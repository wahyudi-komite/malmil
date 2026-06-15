import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get('products')
  async findAllPublic(@Query() query: ProductQueryDto) {
    return this.productsService.findAllPublic(query);
  }

  @Public()
  @Get('products/featured')
  async findFeatured(@Query('limit') limit?: number) {
    return this.productsService.findFeatured(limit || 8);
  }

  @Public()
  @Get('products/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Public()
  @Get('categories')
  async findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('products_view')
  @Get('admin/products')
  async findAllAdmin(@Query() query: any) {
    return this.productsService.findAllAdmin(query);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('products_view')
  @Get('admin/products/:id')
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('products_create')
  @Post('admin/products')
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('products_edit')
  @Put('admin/products/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('products_delete')
  @Delete('admin/products/:id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('categories_create')
  @Post('admin/categories')
  async createCategory(@Body() data: any) {
    return this.productsService.createCategory(data);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('categories_edit')
  @Put('admin/categories/:id')
  async updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.productsService.updateCategory(id, data);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('categories_delete')
  @Delete('admin/categories/:id')
  async removeCategory(@Param('id') id: string) {
    return this.productsService.removeCategory(id);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('categories_view')
  @Get('admin/categories')
  async findAllCategoriesAdmin() {
    return this.productsService.findAllCategoriesAdmin();
  }
}
