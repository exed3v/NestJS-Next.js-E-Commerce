import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtUser } from '../../common/interfaces/jwt-payload';

import { UploadImagesInterceptor } from '../../common/interceptors/upload.interceptor';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(UploadImagesInterceptor())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        compareAtPrice: { type: 'number' },
        costPerItem: { type: 'number' },
        stock: { type: 'number' },
        sku: { type: 'string' },
        barcode: { type: 'string' },
        isActive: { type: 'boolean' },
        isFeatured: { type: 'boolean' },
        weight: { type: 'number' },
        categoryId: { type: 'string' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: { user: JwtUser },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.create(createProductDto, req.user, files);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get all active products' })
  // @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  // findAll() {
  //   return this.productsService.findAll();
  // }

  @Get()
  @ApiOperation({ summary: 'Get all products with filters' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.productsService.findAll({
      categoryId,
      search,
      minPrice,
      maxPrice,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug (SEO friendly)' })
  @ApiParam({ name: 'slug', description: 'Product slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: { user: JwtUser },
  ) {
    return this.productsService.update(id, updateProductDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  async remove(@Param('id') id: string, @Req() req: { user: JwtUser }) {
    await this.productsService.remove(id, req.user);
  }

  // VARIANTSSSS

  @Post(':id/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add variant to product (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  addVariant(
    @Param('id') id: string,
    @Body() createVariantDto: CreateVariantDto,
    @Req() req: { user: JwtUser },
  ) {
    return this.productsService.addVariant(id, createVariantDto, req.user);
  }

  @Get(':id/variants')
  @ApiOperation({ summary: 'Get all variants of a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  getVariants(@Param('id') id: string) {
    return this.productsService.getVariants(id);
  }

  @Patch('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update variant (Admin only)' })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  updateVariant(
    @Param('variantId') variantId: string,
    @Body() updateVariantDto: UpdateVariantDto,
    @Req() req: { user: JwtUser },
  ) {
    return this.productsService.updateVariant(
      variantId,
      updateVariantDto,
      req.user,
    );
  }

  @Delete('variants/:variantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete variant (Admin only)' })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  async removeVariant(
    @Param('variantId') variantId: string,
    @Req() req: { user: JwtUser },
  ) {
    await this.productsService.removeVariant(variantId, req.user);
  }
}
