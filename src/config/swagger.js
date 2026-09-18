const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

const string = { type: 'string' };
const number = { type: 'number' };

function obj(properties, required = []) {
  return { type: 'object', required, properties };
}

const definition = {
  openapi: '3.0.0',
  info: { title: 'Grocery Store API', version: '1.0.0', description: 'REST API quan ly cua hang tap hoa' },
  servers: [{ url: `http://localhost:${env.port}/api` }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      RegisterInput: obj({ name: string, email: string, password: string }, ['name', 'email', 'password']),
      LoginInput: obj({ email: string, password: string }, ['email', 'password']),
      CategoryInput: obj(
        { code: string, name: string, description: string, status: { type: 'string', enum: ['active', 'inactive'] } },
        ['code', 'name']
      ),
      ProductInput: obj(
        {
          sku: string,
          barcode: string,
          name: string,
          categoryId: string,
          costPrice: number,
          sellPrice: number,
          vatPercent: number,
          unit: string,
          stockQty: number,
          minStock: number,
          description: string,
          imageUrl: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['active', 'inactive'] }
        },
        ['sku', 'name', 'categoryId', 'sellPrice']
      ),
      CheckoutInput: obj(
        {
          items: {
            type: 'array',
            items: obj({ productId: string, quantity: { type: 'number', minimum: 1 } }, ['productId', 'quantity'])
          },
          paymentMethod: { type: 'string', enum: ['cash', 'transfer', 'card'] },
          vatPercent: number,
          customerId: { type: 'string', description: 'Khong bat buoc' }
        },
        ['items']
      ),
      OrderStatusInput: obj({ status: { type: 'string', enum: ['completed', 'processing', 'cancelled'] } }, ['status']),
      CustomerInput: obj({ name: string, phone: string, email: string, address: string, note: string }, ['name', 'phone']),
      SupplierInput: obj(
        { name: string, contactName: string, phone: string, email: string, address: string, categoryLabel: string },
        ['name']
      ),
      AdjustmentInput: obj(
        {
          productId: string,
          type: { type: 'string', enum: ['in', 'out', 'adjust'], description: 'adjust = dat ton kho bang quantity' },
          quantity: number,
          unit: string,
          reason: string
        },
        ['productId', 'type', 'quantity']
      ),
      StoreInput: obj({ name: string, phone: string, address: string, taxCode: string, currency: string, timezone: string }),
      StaffInput: obj(
        { name: string, email: string, role: { type: 'string', enum: ['admin', 'cashier', 'warehouse', 'manager'] } },
        ['name', 'email', 'role']
      )
    }
  }
};

module.exports = swaggerJsdoc({
  definition,
  apis: [path.join(__dirname, '../routes/*.js')]
});
