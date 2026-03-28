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

  // async create(
  //   createProductDto: CreateProductDto,
  //   currentUser: JwtUser,
  //   files: Express.Multer.File[],
  // ) {
  //   if (currentUser.role !== 'ADMIN') {
  //     throw new ForbiddenException('Only admins can create products');
  //   }

  //   const slug = this.generateSlug(createProductDto.name);

  //   // Subir imágenes a Cloudinary
  //   const uploadedImages = await Promise.all(
  //     files.map(async (file, index) => {
  //       // Convertir buffer a base64 para subir
  //       const base64 = file.buffer.toString('base64');
  //       const dataUri = `data:${file.mimetype};base64,${base64}`;

  //       const result = await this.cloudinaryClient.uploader.upload(dataUri, {
  //         folder: 'products',
  //       });

  //       return {
  //         url: result.secure_url,
  //         isMain: index === 0,
  //         order: index,
  //       };
  //     }),
  //   );

  //   // Crear producto con sus imágenes
  //   return this.prisma.product.create({
  //     data: {
  //       name: createProductDto.name,
  //       slug,
  //       description: createProductDto.description,
  //       price: createProductDto.price,
  //       compareAtPrice: createProductDto.compareAtPrice,
  //       costPerItem: createProductDto.costPerItem,
  //       stock: createProductDto.stock ?? 0,
  //       sku: createProductDto.sku,
  //       barcode: createProductDto.barcode,
  //       isActive: createProductDto.isActive ?? true,
  //       isFeatured: createProductDto.isFeatured ?? false,
  //       weight: createProductDto.weight,
  //       categoryId: createProductDto.categoryId,
  //       images: {
  //         create: uploadedImages,
  //       },
  //     },
  //     include: {
  //       category: true,
  //       images: {
  //         orderBy: { order: 'asc' },
  //       },
  //     },
  //   });
  // }

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
    let uploadedImages: any[] = [];
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

  async findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
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

    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
