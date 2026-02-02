using System;
using System.Collections.Generic;

namespace Order.Sample.Models
{
    /// <summary>
    /// Product category DTO.
    /// </summary>
    public class ProductCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    /// <summary>
    /// Order status DTO.
    /// </summary>
    public class OrderStatus
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    /// <summary>
    /// Product order search criteria.
    /// </summary>
    public class OrderSearchCriteria
    {
        public int? CategoryId { get; set; }
        public int? StatusId { get; set; }
        public string CustomerName { get; set; }
        public decimal? MinimumOrderTotal { get; set; }
        public decimal? MaximumOrderTotal { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? MinimumQuantity { get; set; }
        public int DateRangeDays { get; set; } = 90;
    }

    /// <summary>
    /// Product order data container.
    /// </summary>
    public class OrderListData
    {
        public string description { get; set; }
        public int totalCount { get; set; }
        public List<ProductOrderItem> rows { get; set; } = new List<ProductOrderItem>();
    }

    /// <summary>
    /// Individual product order item.
    /// </summary>
    public class ProductOrderItem
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public string ProductName { get; set; }
        public string CategoryName { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public DateTime OrderDate { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal OrderTotal { get; set; }
        public decimal Discount { get; set; }
        public string Status { get; set; }
        public string ShippingMethod { get; set; }
        public DateTime? ShippedDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public int PriorityScore { get; set; }
    }

    /// <summary>
    /// Pending orders data container.
    /// </summary>
    public class PendingOrdersData
    {
        public int totalCount { get; set; }
        public int maxCount { get; set; }
        public List<PendingOrderItem> items { get; set; } = new List<PendingOrderItem>();
    }

    /// <summary>
    /// Individual pending order item.
    /// </summary>
    public class PendingOrderItem
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public string ProductName { get; set; }
        public string CustomerName { get; set; }
        public decimal OrderTotal { get; set; }
        public int Priority { get; set; }
    }

    /// <summary>
    /// Queue status information.
    /// </summary>
    public class QueueStatus
    {
        public int QueueLength { get; set; }
        public string LastUpdated { get; set; }
        public string Status { get; set; }
    }

    /// <summary>
    /// Order detail item for expanded view.
    /// </summary>
    public class OrderDetailItem
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public string ProductName { get; set; }
        public string ProductSku { get; set; }
        public string CategoryName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal LineTotal { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string ShippingAddress { get; set; }
        public string ShippingCity { get; set; }
        public string ShippingState { get; set; }
        public string ShippingPostalCode { get; set; }
        public string ShippingPhone { get; set; }
        public string TrackingNumber { get; set; }
        public string DetailUri { get; set; }
    }
}
