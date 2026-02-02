using System;
using System.Web;
using Newtonsoft.Json;
using Order.Sample.Models;

namespace Order.Sample.Order.List
{
    /// <summary>
    /// HTTP handler that provides randomized product order data for AJAX requests.
    /// </summary>
    public class OrderDataHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";

            string action = context.Request.QueryString["Action"] ?? context.Request.Form["Action"];

            if (string.Equals(action, "OrderDetails", StringComparison.OrdinalIgnoreCase))
            {
                ProcessOrderDetailsRequest(context);
            }
            else
            {
                ProcessOrderListRequest(context);
            }
        }

        private void ProcessOrderListRequest(HttpContext context)
        {
            // Parse criteria from query string
            var criteria = new OrderSearchCriteria();

            string categoryId = context.Request.QueryString["CategoryId"];
            if (!string.IsNullOrEmpty(categoryId) && int.TryParse(categoryId, out int catId))
            {
                criteria.CategoryId = catId;
            }

            string statusId = context.Request.QueryString["StatusId"];
            if (!string.IsNullOrEmpty(statusId) && int.TryParse(statusId, out int statId))
            {
                criteria.StatusId = statId;
            }

            criteria.CustomerName = context.Request.QueryString["CustomerName"];

            string minTotal = context.Request.QueryString["MinimumOrderTotal"];
            if (!string.IsNullOrEmpty(minTotal) && decimal.TryParse(minTotal, out decimal minTotalVal))
            {
                criteria.MinimumOrderTotal = minTotalVal;
            }

            string maxTotal = context.Request.QueryString["MaximumOrderTotal"];
            if (!string.IsNullOrEmpty(maxTotal) && decimal.TryParse(maxTotal, out decimal maxTotalVal))
            {
                criteria.MaximumOrderTotal = maxTotalVal;
            }

            string minQty = context.Request.QueryString["MinimumQuantity"];
            if (!string.IsNullOrEmpty(minQty) && int.TryParse(minQty, out int minQtyVal))
            {
                criteria.MinimumQuantity = minQtyVal;
            }

            string dateRange = context.Request.QueryString["DateRangeDays"];
            if (!string.IsNullOrEmpty(dateRange) && int.TryParse(dateRange, out int dateRangeVal))
            {
                criteria.DateRangeDays = dateRangeVal;
            }

            // Generate randomized data
            var data = MockDataGenerator.GenerateOrderData(criteria);

            context.Response.Write(JsonConvert.SerializeObject(data));
        }

        private void ProcessOrderDetailsRequest(HttpContext context)
        {
            string orderNumber = context.Request.QueryString["OrderNumber"] ?? context.Request.Form["OrderNumber"];

            var items = MockDataGenerator.GenerateOrderDetails(orderNumber);

            var response = new
            {
                totalCount = items.Count,
                rows = items
            };

            context.Response.Write(JsonConvert.SerializeObject(response));
        }

        public bool IsReusable
        {
            get { return false; }
        }
    }
}
