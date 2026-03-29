import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtUser } from '../../common/interfaces/jwt-payload';
@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async create(createCategoryDto: CreateCategoryDto, currentUser: JwtUser) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create categories');
    }

    const slug = this.generateSlug(createCategoryDto.name);

    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        slug,
        description: createCategoryDto.description,
        image: createCategoryDto.image,
        parentId: createCategoryDto.parentId || null,
      },
    });
  }

  //   async findAll() {
  //     return this.prisma.category.findMany({
  //       orderBy: { order: 'asc' },
  //       include: {
  //         parent: true,
  //         children: true,
  //         products: {
  //           take: 5, // Solo para preview, no traer todos
  //           select: {
  //             id: true,
  //             name: true,
  //             slug: true,
  //             price: true,
  //             images: true,
  //           },
  //         },
  //       },
  //     });
  //   }

  async findAll() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
      include: {
        children: {
          orderBy: { name: 'asc' },
          include: {
            children: {
              orderBy: { name: 'asc' },
            },
          },
        },
        products: {
          take: 5,
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          },
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

    await this.findOne(id);

    // Verificar si tiene productos asociados
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: { take: 1 } },
    });

    if (category?.products) {
      if (category?.products.length > 0) {
        throw new ForbiddenException(
          'Cannot delete category with associated products',
        );
      }
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
