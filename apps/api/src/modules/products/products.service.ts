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

  async create(
    createProductDto: CreateProductDto,
    currentUser: JwtUser,
    files: Express.Multer.File[],
  ) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create products');
    }

    const slug = this.generateSlug(createProductDto.name);

    // Subir imágenes a Cloudinary
    const uploadedImages = await Promise.all(
      files.map(async (file, index) => {
        // Convertir buffer a base64 para subir
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

    // Crear producto con sus imágenes
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        slug,
        description: createProductDto.description,
        price: createProductDto.price,
        compareAtPrice: createProductDto.compareAtPrice,
        costPerItem: createProductDto.costPerItem,
        stock: createProductDto.stock ?? 0,
        sku: createProductDto.sku,
        barcode: createProductDto.barcode,
        isActive: createProductDto.isActive ?? true,
        isFeatured: createProductDto.isFeatured ?? false,
        weight: createProductDto.weight,
        categoryId: createProductDto.categoryId,
        images: {
          create: uploadedImages,
        },
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

    const updateData: any = { ...updateProductDto };

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
