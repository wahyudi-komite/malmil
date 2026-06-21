import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Produk')
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Mendapatkan daftar produk publik' })
  @ApiQuery({ name: 'search', required: false, description: 'Kata kunci pencarian' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter kategori' })
  @ApiQuery({ name: 'min_price', required: false, description: 'Harga minimum' })
  @ApiQuery({ name: 'max_price', required: false, description: 'Harga maksimum' })
  @ApiQuery({ name: 'sort', required: false, description: 'Urutkan' })
  @ApiQuery({ name: 'page', required: false, description: 'Halaman' })
  @ApiQuery({ name: 'limit', required: false, description: 'Jumlah per halaman' })
  @Public()
  @Get('products')
  async findAllPublic(@Query() query: ProductQueryDto) {
    return this.productsService.findAllPublic(query);
  }

  @ApiOperation({ summary: 'Mendapatkan produk unggulan' })
  @ApiQuery({ name: 'limit', required: false, description: 'Jumlah produk' })
  @Public()
  @Get('products/featured')
  async findFeatured(@Query('limit') limit?: number) {
    return this.productsService.findFeatured(limit || 8);
  }

  @ApiOperation({ summary: 'Mendapatkan detail produk berdasarkan slug' })
  @ApiParam({ name: 'slug', description: 'Slug produk' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  @Public()
  @Get('products/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Mendapatkan daftar kategori' })
  @Public()
  @Get('categories')
  async findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @ApiOperation({ summary: 'Mendapatkan daftar produk (admin)' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('products_view')
  @Get('admin/products')
  async findAllAdmin(@Query() query: any) {
    return this.productsService.findAllAdmin(query);
  }

  @ApiOperation({ summary: 'Mendapatkan detail produk (admin)' })
  @ApiParam({ name: 'id', description: 'ID produk' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('products_view')
  @Get('admin/products/:id')
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @ApiOperation({ summary: 'Membuat produk baru' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('products_create')
  @Post('admin/products')
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @ApiOperation({ summary: 'Memperbarui produk' })
  @ApiParam({ name: 'id', description: 'ID produk' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('products_edit')
  @Put('admin/products/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Menghapus produk' })
  @ApiParam({ name: 'id', description: 'ID produk' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('products_delete')
  @Delete('admin/products/:id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @ApiOperation({ summary: 'Membuat kategori baru' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('categories')
  @Post('admin/categories')
  async createCategory(@Body() data: any) {
    return this.productsService.createCategory(data);
  }

  @ApiOperation({ summary: 'Memperbarui kategori' })
  @ApiParam({ name: 'id', description: 'ID kategori' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('categories')
  @Put('admin/categories/:id')
  async updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.productsService.updateCategory(id, data);
  }

  @ApiOperation({ summary: 'Menghapus kategori' })
  @ApiParam({ name: 'id', description: 'ID kategori' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('categories')
  @Delete('admin/categories/:id')
  async removeCategory(@Param('id') id: string) {
    return this.productsService.removeCategory(id);
  }

  @ApiOperation({ summary: 'Mendapatkan daftar kategori (admin)' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('categories')
  @Get('admin/categories')
  async findAllCategoriesAdmin() {
    return this.productsService.findAllCategoriesAdmin();
  }
}
