import Panel from '../components/Panel';
import Button from '../components/Button';
import { Order, Product } from '../../../shared/types/payments';
import devvitClient from '../lib/DevvitClient';
import React, { useState, useEffect } from 'react';

enum PaymentsTab {
  Products,
  Orders,
}


const PaymentsPage: React.FC = () => {

  const [products, setProducts] = useState<Product[]|undefined>(undefined);
  const [orders, setOrders] = useState<Order[]|undefined>(undefined);
  const [currentTab, setCurrentTab] = useState<PaymentsTab>(PaymentsTab.Products);

  useEffect(() => {
    // Set up message handler for Payments data
    devvitClient.on('fetchAvailableProductsResponse', (message) => {
      if ('products' in message.data) {
        setProducts(message.data.products as Product[]);
      }
    });

    devvitClient.on('fetchOrdersResponse', (message) => {
      if ('orders' in message.data) {
        setOrders(message.data.orders as Order[]);
      }
    });

    devvitClient.on('buyProductResponse', (message) => {
      console.log('WebView', 'Received buy product callback', message);
    });

    // Clean up event listeners when component unmounts
    return () => {
      devvitClient.off('fetchAvailableProductsResponse');
      devvitClient.off('fetchOrdersResponse');
      devvitClient.off('buyProductResponse');
    };
  }, []);

  const fetchProducts = () => {
    setCurrentTab(PaymentsTab.Products);
    devvitClient.postMessage({ type: 'fetchAvailableProducts' });
  };

  const fetchOrders = () => {
    setCurrentTab(PaymentsTab.Orders);
    devvitClient.postMessage({ type: 'fetchOrders' });
  };

  const buyProduct = (sku:string) => {
    devvitClient.postMessage({ type: 'buyProduct', data: { sku } });
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Payments</h1>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 sm:w-48">
          <Button onClick={fetchProducts}>Load Products</Button>
          <Button onClick={fetchOrders}>Load Orders</Button>
        </div>
        
        <div className="flex-1">
          <Panel title={currentTab === PaymentsTab.Products ? "Products" : "Orders"} >
            {currentTab === PaymentsTab.Products  && (
              <>
              {products === undefined ? (
                <p className="text-gray-600">Click on load products</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price (Gold)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buy 
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {entry.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                          {entry.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                          <Button onClick={() => buyProduct(entry.sku)}>Buy</Button>  
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}  
              </> 
            )}      
            {currentTab === PaymentsTab.Orders  && (
              <>
              {orders === undefined ? (
                <p className="text-gray-600">Click on load orders</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {entry.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                          {entry.purchaseDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}  
              </> 
            )}      
          </Panel>          
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;