import Client from './Client.js';
import Admin from './Admin.js';
import Product from './Product.js';

export const seedInicial = async () => {
  const adminCount = await Admin.count();
  if (adminCount === 0) {
    await Admin.bulkCreate([
    {
      nombre: 'SuperAdmin',
      email: 'superadmin@tienda.com',
      password: 'superadmin123',
      role: 'superadmin'
    },
    {
      nombre: 'gestor_productos',
      email: 'gestor_productos@tienda.com',
      password: 'gestor_productos123',
      role: 'gestor_productos'
    },
    {
      nombre: 'Auditor',
      email: 'auditor@tienda.com',
      password: 'auditor123',
      role: 'auditor'
    }],{ individualHooks: true });

    console.log('Seed: Roles de Administracion creados.');
  }

  const clientCount = await Client.count();
  if (clientCount === 0) {
    await Client.create({
      nombre: 'Cliente',
      email: 'cliente@tienda.com',
      password: 'cliente123',
    });
    console.log('Seed: cliente@tienda.com creado.');
  }

  const productCount = await Product.count();
  if (productCount === 0) {
    await Product.bulkCreate([
      { name: 'Laptop', price: 1000, stock: 10, category: 'Electronica' },
      { name: 'Patito de goma', price: 20, stock: 20, category: 'Accesorios Dev' },
      { name: 'Camiseta', price: 150, stock: 25, category: 'Ropa' },
      { name: 'Enter Gigante para desestresarse', price: 100, stock: 30, category: 'Accesorios Dev' },
      { name: 'Pelota', price: 50, stock: 20, category: 'Juguetes' },
    ]);
    console.log('Seed: 5 products creados.');
  }
};

export { Client, Admin, Product };
