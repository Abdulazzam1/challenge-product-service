// src/product/product.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Repository } from 'typeorm';

// 1. Buat "Mock" untuk dependensi
const mockProductRepository = {
  findOneBy: jest.fn(),
  // Kita juga perlu mock 'save' dan 'create' jika menguji method 'create'
};

const mockAmqpConnection = {
  publish: jest.fn(),
};

// Tipe helper untuk mock repository
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ProductService', () => {
  let service: ProductService;
  let repository: MockRepository<Product>;

  // 2. Setup modul tes sebelum setiap tes
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          // Sediakan mock 'ProductRepository'
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          // Sediakan mock 'AmqpConnection'
          provide: AmqpConnection,
          useValue: mockAmqpConnection,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<MockRepository<Product>>(
      getRepositoryToken(Product),
    );
  });

  // 3. Reset mock setelah setiap tes
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 4. Tes pertama: 'findOne'
  it('should find a product by ID', async () => {
    // Siapkan data palsu
    const testId = 'test-uuid';
    const mockProduct = {
      id: testId,
      name: 'Test Product',
      price: 100,
      qty: 10,
    } as Product;

    // Atur mock repository: "Jika 'findOneBy' dipanggil, kembalikan 'mockProduct'"
    mockProductRepository.findOneBy.mockResolvedValue(mockProduct);

    // Panggil fungsi yang ingin kita tes
    const result = await service.findOne(testId);

    // Verifikasi
    // Pastikan hasilnya adalah data palsu kita
    expect(result).toEqual(mockProduct);
    // Pastikan repository dipanggil dengan ID yang benar
    expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({
      id: testId,
    });
  });
});