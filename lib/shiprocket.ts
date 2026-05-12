export const shiprocket = {
  createOrder: async (orderDetails: any) => {
    console.log('[Shiprocket Mock] Creating order:', orderDetails)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      order_id: `sr_order_${Math.floor(Math.random() * 100000)}`,
      shipment_id: `sr_shipment_${Math.floor(Math.random() * 100000)}`,
      status: 'NEW',
      status_code: 1,
      awb_code: null,
      courier_company_id: null,
      courier_name: null,
    }
  },
  
  trackOrder: async (shipmentId: string) => {
    console.log('[Shiprocket Mock] Tracking shipment:', shipmentId)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      tracking_data: {
        track_status: 1,
        shipment_status: 1,
        shipment_track: [{
          current_status: 'PICKED UP',
          date: new Date().toISOString()
        }]
      }
    }
  }
}
