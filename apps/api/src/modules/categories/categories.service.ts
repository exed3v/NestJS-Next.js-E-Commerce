import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtUser } from '../../common/interfaces/jwt-payload';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
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
    createCategoryDto: CreateCategoryDto,
    currentUser: JwtUser,
    file?: Express.Multer.File,
  ) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create categories');
    }

    const slug = this.generateSlug(createCategoryDto.name);

    // 1. Validar que el nombre no exista
    const existing = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });
    if (existing) {
      throw new ForbiddenException('Category with this name already exists');
    }

    // 2. Validar parentId si se proporciona
    if (createCategoryDto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: createCategoryDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    // 3. Subir imagen a Cloudinary (si hay archivo)
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.cloudinaryService.uploadSingle(file, 'categories');
    }

    // 4. Crear categoría
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        slug,
        description: createCategoryDto.description,
        image: imageUrl,
        parentId: createCategoryDto.parentId || null,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
      include: {
        children: {
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          where: { isActive: true },
          include: {
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        products: {
          where: { isActive: true },
          include: {
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    currentUser: JwtUser,
  ) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update categories');
    }

    await this.findOne(id);

    const updateData: any = { ...updateCategoryDto };

    if (updateCategoryDto.name) {
      updateData.slug = this.generateSlug(updateCategoryDto.name);
    }

    return this.prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async remove(id: string, currentUser: JwtUser) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete categories');
    }

    // 1. Obtener la categoría con su imagen
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: { take: 1 } },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // 2. Verificar si tiene productos asociados
    if (category.products && category.products.length > 0) {
      throw new ForbiddenException(
        'Cannot delete category with associated products',
      );
    }

    // 3. Eliminar de la base de datos
    await this.prisma.category.delete({
      where: { id },
    });

    // 4. Eliminar imagen de Cloudinary (si existe)
    if (category.image) {
      try {
        await this.cloudinaryService.deleteImage(category.image);
      } catch (error) {
        // Loguear pero no lanzar error (la categoría ya se eliminó)
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }

    return { message: 'Category deleted successfully' };
  }
}
