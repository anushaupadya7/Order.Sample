using System;
using System.Collections.Generic;

namespace Order.Sample.Models
{
    /// <summary>
    /// Generates randomized mock data for the Product Orders sample application.
    /// </summary>
    public static class MockDataGenerator
    {
        private static readonly Random _random = new Random();

        private static readonly string[] ProductNames = { 
            "Wireless Bluetooth Headphones", "USB-C Hub Adapter", "Mechanical Keyboard", 
            "Gaming Mouse", "4K Monitor", "Laptop Stand", "Webcam HD", "External SSD",
            "Smart Watch", "Fitness Tracker", "Portable Charger", "Phone Case",
            "Tablet Cover", "Screen Protector", "Lightning Cable", "HDMI Cable"
        };

        private static readonly string[] CustomerFirstNames = { "John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa" };
        private static readonly string[] CustomerLastNames = { "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis" };

        private static readonly string[] ShippingMethods = { "Standard", "Express", "Next Day", "Two-Day", "Economy" };
        private static readonly string[] OrderStatuses = { "Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded" };

        /// <summary>
        /// Gets the list of available product categories.
        /// </summary>
        public static List<ProductCategory> GetProductCategories()
        {
            return new List<ProductCategory>
            {
                new ProductCategory { Id = 1, Name = "Electronics" },
                new ProductCategory { Id = 2, Name = "Accessories" },
                new ProductCategory { Id = 3, Name = "Computers" },
                new ProductCategory { Id = 4, Name = "Mobile" },
                new ProductCategory { Id = 5, Name = "Audio" },
                new ProductCategory { Id = 6, Name = "Wearables" }
            };
        }

        /// <summary>
        /// Gets the list of available order statuses.
        /// </summary>
        public static List<OrderStatus> GetOrderStatuses()
        {
            return new List<OrderStatus>
            {
                new OrderStatus { Id = 1, Name = "Pending" },
                new OrderStatus { Id = 2, Name = "Processing" },
                new OrderStatus { Id = 3, Name = "Shipped" },
                new OrderStatus { Id = 4, Name = "Delivered" },
                new OrderStatus { Id = 5, Name = "Cancelled" },
                new OrderStatus { Id = 6, Name = "Refunded" }
            };
        }

        /// <summary>
        /// Gets the list of customer names for filtering.
        /// </summary>
        public static List<string> GetCustomerNames()
        {
            var names = new List<string>();
            foreach (var first in CustomerFirstNames)
            {
                foreach (var last in CustomerLastNames)
                {
                    names.Add(first + " " + last);
                    if (names.Count >= 10) break;
                }
                if (names.Count >= 10) break;
            }
            return names;
        }

        /// <summary>
        /// Generates randomized product order data.
        /// </summary>
        public static OrderListData GenerateOrderData(OrderSearchCriteria criteria = null)
        {
            var items = new List<ProductOrderItem>();
            int count = _random.Next(15, 30);
            var categories = GetProductCategories();

            for (int i = 0; i < count; i++)
            {
                string productName = ProductNames[_random.Next(ProductNames.Length)];
                var category = categories[_random.Next(categories.Count)];
                string customerFirst = CustomerFirstNames[_random.Next(CustomerFirstNames.Length)];
                string customerLast = CustomerLastNames[_random.Next(CustomerLastNames.Length)];
                string customerName = customerFirst + " " + customerLast;
                string status = OrderStatuses[_random.Next(OrderStatuses.Length)];

                // Apply category filter
                if (criteria != null && criteria.CategoryId.HasValue && category.Id != criteria.CategoryId.Value)
                {
                    continue;
                }

                // Apply status filter
                if (criteria != null && criteria.StatusId.HasValue)
                {
                    var statuses = GetOrderStatuses();
                    var selectedStatus = statuses.Find(s => s.Id == criteria.StatusId.Value);
                    if (selectedStatus != null && status != selectedStatus.Name)
                    {
                        continue;
                    }
                }

                // Apply customer name filter
                if (criteria != null && !string.IsNullOrEmpty(criteria.CustomerName) && 
                    !customerName.Equals(criteria.CustomerName, StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                int quantity = _random.Next(1, 10);
                decimal unitPrice = (decimal)(_random.Next(1000, 50000) / 100.0);
                decimal discount = (decimal)(_random.Next(0, 20) / 100.0) * unitPrice * quantity;
                decimal orderTotal = (unitPrice * quantity) - discount;

                // Apply order total filters
                if (criteria != null)
                {
                    if (criteria.MinimumOrderTotal.HasValue && orderTotal < criteria.MinimumOrderTotal.Value) continue;
                    if (criteria.MaximumOrderTotal.HasValue && orderTotal > criteria.MaximumOrderTotal.Value) continue;
                }

                // Apply quantity filter
                if (criteria != null && criteria.MinimumQuantity.HasValue && quantity < criteria.MinimumQuantity.Value) continue;

                DateTime orderDate = DateTime.Now.AddDays(-_random.Next(1, criteria?.DateRangeDays ?? 90));
                DateTime? shippedDate = status == "Shipped" || status == "Delivered" ? orderDate.AddDays(_random.Next(1, 3)) : (DateTime?)null;
                DateTime? deliveryDate = status == "Delivered" ? shippedDate?.AddDays(_random.Next(2, 7)) : (DateTime?)null;

                items.Add(new ProductOrderItem
                {
                    Id = i + 1,
                    OrderNumber = "ORD-" + _random.Next(100000, 999999),
                    ProductName = productName,
                    CategoryName = category.Name,
                    CustomerName = customerName,
                    CustomerEmail = customerFirst.ToLower() + "." + customerLast.ToLower() + "@email.com",
                    OrderDate = orderDate,
                    Quantity = quantity,
                    UnitPrice = unitPrice,
                    OrderTotal = orderTotal,
                    Discount = discount,
                    Status = status,
                    ShippingMethod = ShippingMethods[_random.Next(ShippingMethods.Length)],
                    ShippedDate = shippedDate,
                    DeliveryDate = deliveryDate,
                    PriorityScore = _random.Next(1, 100)
                });
            }

            return new OrderListData
            {
                description = GetFilterDescription(criteria),
                totalCount = items.Count,
                rows = items
            };
        }

        /// <summary>
        /// Generates randomized pending orders data.
        /// </summary>
        public static PendingOrdersData GeneratePendingOrdersData()
        {
            var items = new List<PendingOrderItem>();

            for (int i = 0; i < 5; i++)
            {
                string productName = ProductNames[_random.Next(ProductNames.Length)];
                string customerFirst = CustomerFirstNames[_random.Next(CustomerFirstNames.Length)];
                string customerLast = CustomerLastNames[_random.Next(CustomerLastNames.Length)];

                items.Add(new PendingOrderItem
                {
                    Id = i + 1,
                    OrderNumber = "ORD-" + _random.Next(100000, 999999),
                    ProductName = productName,
                    CustomerName = customerFirst + " " + customerLast,
                    OrderTotal = (decimal)(_random.Next(2000, 100000) / 100.0),
                    Priority = i + 1
                });
            }

            return new PendingOrdersData
            {
                totalCount = items.Count,
                maxCount = 25,
                items = items
            };
        }

        /// <summary>
        /// Generates queue status data.
        /// </summary>
        public static QueueStatus GenerateQueueStatus()
        {
            return new QueueStatus
            {
                QueueLength = _random.Next(0, 50),
                LastUpdated = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                Status = "Active"
            };
        }

        /// <summary>
        /// Generates order detail items.
        /// </summary>
        public static List<OrderDetailItem> GenerateOrderDetails(string orderNumber)
        {
            var items = new List<OrderDetailItem>();
            int count = _random.Next(1, 5);
            var categories = GetProductCategories();

            var addresses = new[]
            {
                new { Address = "123 Main St", City = "New York", State = "NY", Postal = "10001", Phone = "(212) 555-1234" },
                new { Address = "456 Oak Ave", City = "Los Angeles", State = "CA", Postal = "90001", Phone = "(310) 555-5678" },
                new { Address = "789 Elm Blvd", City = "Chicago", State = "IL", Postal = "60601", Phone = "(312) 555-9012" },
                new { Address = "321 Pine Rd", City = "Houston", State = "TX", Postal = "77001", Phone = "(713) 555-3456" }
            };

            for (int i = 0; i < count; i++)
            {
                var address = addresses[_random.Next(addresses.Length)];
                var category = categories[_random.Next(categories.Count)];
                string customerFirst = CustomerFirstNames[_random.Next(CustomerFirstNames.Length)];
                string customerLast = CustomerLastNames[_random.Next(CustomerLastNames.Length)];
                int quantity = _random.Next(1, 5);
                decimal unitPrice = (decimal)(_random.Next(1000, 50000) / 100.0);

                items.Add(new OrderDetailItem
                {
                    Id = i + 1,
                    OrderNumber = orderNumber ?? "ORD-" + _random.Next(100000, 999999),
                    ProductName = ProductNames[_random.Next(ProductNames.Length)],
                    ProductSku = "SKU-" + _random.Next(10000, 99999),
                    CategoryName = category.Name,
                    Quantity = quantity,
                    UnitPrice = unitPrice,
                    LineTotal = unitPrice * quantity,
                    CustomerName = customerFirst + " " + customerLast,
                    CustomerEmail = customerFirst.ToLower() + "." + customerLast.ToLower() + "@email.com",
                    ShippingAddress = address.Address,
                    ShippingCity = address.City,
                    ShippingState = address.State,
                    ShippingPostalCode = address.Postal,
                    ShippingPhone = address.Phone,
                    TrackingNumber = "TRK" + _random.Next(1000000000, int.MaxValue),
                    DetailUri = "#"
                });
            }

            return items;
        }

        private static string GetFilterDescription(OrderSearchCriteria criteria)
        {
            if (criteria == null)
            {
                return "All Product Orders - <span>no filters</span>";
            }

            var parts = new List<string>();
            var categories = GetProductCategories();
            var statuses = GetOrderStatuses();

            if (criteria.CategoryId.HasValue)
            {
                var cat = categories.Find(c => c.Id == criteria.CategoryId.Value);
                if (cat != null) parts.Add("Category: " + cat.Name);
            }
            if (criteria.StatusId.HasValue)
            {
                var status = statuses.Find(s => s.Id == criteria.StatusId.Value);
                if (status != null) parts.Add("Status: " + status.Name);
            }
            if (!string.IsNullOrEmpty(criteria.CustomerName)) parts.Add("Customer: " + criteria.CustomerName);
            if (criteria.MinimumOrderTotal.HasValue || criteria.MaximumOrderTotal.HasValue)
            {
                parts.Add("Total: $" + (criteria.MinimumOrderTotal ?? 0) + " - $" + (criteria.MaximumOrderTotal?.ToString() ?? "Any"));
            }

            if (parts.Count == 0)
            {
                return "All Product Orders - <span>no filters</span>";
            }

            return "Filtered: <span>" + string.Join(", ", parts) + "</span>";
        }
    }
}
