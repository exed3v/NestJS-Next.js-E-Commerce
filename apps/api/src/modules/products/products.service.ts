import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtUser } from 'src/common/interfaces/jwt-payload';

import { Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

interface FindAllFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface ProductWhereInput {
  isActive: boolean;
  categoryId?: { in: string[] };
  name?: { contains: string; mode: 'insensitive' };
  price?: { gte?: number; lte?: number };
}

interface UploadedImage {
  url: string;
  isMain: boolean;
  order: number;
}

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    @Inject('CLOUDINARY') private cloudinaryClient: typeof cloudinary,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private async uploadImages(files: Express.Multer.File[]) {
    return Promise.all(
      files.map(async (file, index) => {
        const base64 = file.buffer.toString('base64');
        const dataUri = `data:${file.mimetype};base64,${base64}`;
        const result = await this.cloudinaryClient.uploader.upload(dataUri, {
          folder: 'products',
        });
        return {
          url: result.secure_url,
          isMain: index === 0,
          order: index,
        };
      }),
    );
  }

  private transformProductData(dto: CreateProductDto) {
    return {
      name: dto.name,
      description: dto.description,
      price: Number(dto.price),
      compareAtPrice: dto.compareAtPrice
        ? Number(dto.compareAtPrice)
        : undefined,
      costPerItem: dto.costPerItem ? Number(dto.costPerItem) : undefined,
      stock: dto.stock ? Number(dto.stock) : 0,
      sku: dto.sku,
      barcode: dto.barcode,
      isActive: dto.isActive === undefined ? true : Boolean(dto.isActive),
      isFeatured:
        dto.isFeatured === undefined ? false : Boolean(dto.isFeatured),
      weight: dto.weight ? Number(dto.weight) : undefined,
      categoryId: dto.categoryId || null,
    };
  }

  private async deleteImagesFromCloudinary(images: { url: string }[]) {
    if (images.length === 0) return;

    await Promise.all(
      images.map(async (image) => {
        const publicId = this.extractPublicIdFromUrl(image.url);
        try {
          await this.cloudinaryClient.uploader.destroy(publicId);
        } catch (error) {
          console.error(`Failed to delete image ${publicId}:`, error);
        }
      }),
    );
  }

  private extractPublicIdFromUrl(url: string): string {
    const urlParts = url.split('/');
    const publicIdWithExtension = urlParts.slice(-2).join('/');
    return publicIdWithExtension.split('.')[0];
  }

  async create(
    createProductDto: CreateProductDto,
    currentUser: JwtUser,
    files: Express.Multer.File[],
  ) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create products');
    }

    const slug = this.generateSlug(createProductDto.name);

    // 1. Validar y transformar datos (lanza error si algo está mal)
    const productData = this.transformProductData(createProductDto);

    // 2. Subir imágenes a Cloudinary (si hay archivos)
    let uploadedImages: UploadedImage[] = [];
    if (files && files.length > 0) {
      uploadedImages = await this.uploadImages(files); // Si falla, se detiene aquí
    }

    return this.prisma.product.create({
      data: {
        slug,
        ...productData,
        images:
          uploadedImages.length > 0 ? { create: uploadedImages } : undefined,
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAll(filters: FindAllFilters = {}) {
    const { categoryId, search, minPrice, maxPrice } = filters;

    const where: ProductWhereInput = {
      isActive: true,
    };

    // Filtro por categoría (incluye subcategorías)
    if (categoryId) {
      // Obtener todas las subcategorías
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: { children: true },
      });

      const categoryIds = [categoryId];
      if (category?.children) {
        categoryIds.push(...category.children.map((c) => c.id));
      }

      where.categoryId = { in: categoryIds };
    }

    // Búsqueda por nombre
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    // Filtro por precio
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
        variants: {
          orderBy: [{ type: 'asc' }, { value: 'asc' }],
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    currentUser: JwtUser,
  ) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update products');
    }

    await this.findOne(id);

    const updateData = Object.fromEntries(
      Object.entries(updateProductDto).filter(
        ([, value]) => value !== undefined,
      ),
    );

    // Si se actualiza el nombre, regenerar slug
    if (updateProductDto.name) {
      updateData.slug = this.generateSlug(updateProductDto.name);
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: true,
      },
    });
  }

  async remove(id: string, currentUser: JwtUser) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete products');
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Eliminar imágenes de Cloudinary
    await this.deleteImagesFromCloudinary(product.images);

    // Eliminar producto de la BD
    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  // VARIANTSSSS

  async addVariant(
    productId: string,
    createVariantDto: CreateVariantDto,
    currentUser: JwtUser,
  ) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can manage variants');
    }

    // Verificar que el producto existe
    await this.findOne(productId);

    return this.prisma.productVariant.create({
      data: {
        productId,
        type: createVariantDto.type,
        value: createVariantDto.value,
        price: createVariantDto.price,
        stock: createVariantDto.stock ?? 0,
        sku: createVariantDto.sku,
      },
    });
  }

  async getVariants(productId: string) {
    await this.findOne(productId);

    return this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: [{ type: 'asc' }, { value: 'asc' }],
    });
  }

  async updateVariant(
    variantId: string,
    updateVariantDto: UpdateVariantDto,
    currentUser: JwtUser,
  ) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can manage variants');
    }

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: updateVariantDto,
    });
  }

  async removeVariant(variantId: string, currentUser: JwtUser) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can manage variants');
    }

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return this.prisma.productVariant.delete({
      where: { id: variantId },
    });
  }
}
