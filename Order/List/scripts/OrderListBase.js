/*
 * OrderListBase.js - Base functionality for Product Orders
 * Sample application with randomized mock data
 */

// Utility functions
app.isBlank = function(str) {
    return (!str || /^\s*$/.test(str));
};

app.isNotEmpty = function(value) {
    return value !== null && value !== undefined && value !== '';
};

app.isDefined = function(value) {
    return typeof value !== 'undefined';
};

app.util.commaize = function(value) {
    if (value === null || value === undefined) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

app.util.currency = function(value, decimals) {
    if (value === null || value === undefined) return '';
    decimals = decimals || 2;
    return '$' + parseFloat(value).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

app.util.formatDate = function(dateStr) {
    if (!dateStr) return '';
    var date = new Date(dateStr);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
};

app.util.encodeJson = function(obj) {
    return JSON.stringify(obj);
};

// HTML utilities
app.html.tableMarkup = function(config) {
    var html = '<table';
    if (config.cls) html += ' class="' + config.cls + '"';
    html += '>';
    
    if (config.items) {
        Ext.each(config.items, function(row) {
            if (row) {
                html += '<tr>';
                Ext.each(row, function(cell) {
                    if (typeof cell === 'object') {
                        html += '<td';
                        if (cell.cls) html += ' class="' + cell.cls + '"';
                        if (cell.colspan) html += ' colspan="' + cell.colspan + '"';
                        html += '>';
                        html += cell.html || '';
                        html += '</td>';
                    } else {
                        html += '<td>' + (cell || '') + '</td>';
                    }
                });
                html += '</tr>';
            }
        });
    }
    
    html += '</table>';
    return html;
};

// Form utilities
app.form.FieldManager = {
    create: function(id, obj, p1, p2, p3) {
        return {
            id: id,
            obj: obj,
            getValue: function() {
                if (obj && obj.getValue) return obj.getValue();
                return null;
            },
            setValue: function(value) {
                if (obj && obj.setValue) obj.setValue(value);
            }
        };
    }
};

app.form.wrapTextField = function(elementId, options) {
    var el = Ext.get(elementId);
    if (!el) return null;
    
    return new Ext.form.TextField({
        applyTo: elementId,
        allowBlank: true
    });
};

app.form.wrapNumberField = function(elementId, options) {
    var el = Ext.get(elementId);
    if (!el) return null;
    
    return new Ext.form.NumberField(Ext.apply({
        applyTo: elementId,
        allowBlank: true
    }, options || {}));
};

app.form.wrapComboBox = function(elementId, options) {
    var el = Ext.get(elementId);
    if (!el) return null;
    
    // For select elements, wrap in Ext combo
    var selectEl = Ext.getDom(elementId);
    if (selectEl && selectEl.tagName === 'SELECT') {
        return {
            getValue: function() { return selectEl.value; },
            setValue: function(value) { selectEl.value = value; },
            isValid: function() { return true; },
            on: function(event, fn) {
                Ext.get(selectEl).on('change', fn);
            }
        };
    }
    
    return null;
};

// Order utilities
app.order.updateQueueStatus = function(queueData, elementId) {
    var el = Ext.get(elementId);
    if (el && queueData) {
        el.update('Orders: ' + queueData.QueueLength + ' | Status: ' + queueData.Status);
    }
};

app.order.closeReportCard = function() {
    // Close any open report cards
};

app.order.addVersionToggle = function(url, text, tip) {
    // Add version toggle link
};

// Dialog utilities
app.dialogs.openAnchorInWindow = function(anchor, event, windowName) {
    window.open(anchor.href, windowName);
    return false;
};

// Analytics stub
app.analytics.Analytics = {
    logWorkbenchSearchPerformed: function(action, source) {
        console.log('Analytics: Search performed', action, source);
    }
};

// Helper functions for compatibility
function $d(elementId) {
    return Ext.getDom(elementId);
}

function $c(elementId) {
    return Ext.getCmp(elementId);
}

function $e(elementId) {
    return Ext.get(elementId);
}

function $l(element) {
    if (typeof element === 'string') {
        element = Ext.get(element);
    }
    return element;
}

// Array extensions
if (!Array.prototype.stripNulls) {
    Array.prototype.stripNulls = function() {
        return this.filter(function(item) {
            return item !== null && item !== undefined;
        });
    };
}

// Grid Panel extension
app.grid = app.grid || {};
app.grid.GridPanel = Ext.extend(Ext.grid.GridPanel, {
    objectType: 'items',
    pageSize: 20,
    
    initComponent: function() {
        // Add paging toolbar
        this.bbar = new Ext.PagingToolbar({
            pageSize: this.pageSize,
            store: this.store,
            displayInfo: true,
            displayMsg: 'Displaying {0} - {1} of {2} ' + this.objectType,
            emptyMsg: 'No ' + this.objectType + ' to display'
        });
        
        this.bottomToolbar = this.bbar;
        
        app.grid.GridPanel.superclass.initComponent.call(this);
    }
});

// OrderListBase class
app.OrderListBase = function(config) {
    this.config = config || {};
    this.renderTo = config.renderTo;
    this.dataUrl = config.dataUrl;
    this.data = app.page.initialOrderListData || { rows: [] };
    
    this.init();
};

Ext.apply(app.OrderListBase.prototype, {
    init: function() {
        this.render();
    },
    
    render: function() {
        var container = Ext.get(this.renderTo);
        if (!container) return;
        
        var html = this.buildGridHtml();
        container.update(html);
        
        this.attachEventHandlers();
    },
    
    buildGridHtml: function() {
        var items = this.data.rows || [];
        var html = '<div class="orderlist-container">';
        
        if (items.length === 0) {
            html += '<div class="orderlist-empty">No orders available. Adjust your search criteria.</div>';
        } else {
            html += '<ol class="orderlist">';
            
            Ext.each(items, function(item, index) {
                var statusClass = item.Status === 'Delivered' ? 'status-delivered' : 
                    (item.Status === 'Shipped' ? 'status-shipped' : 
                    (item.Status === 'Processing' ? 'status-processing' : 
                    (item.Status === 'Cancelled' || item.Status === 'Refunded' ? 'status-cancelled' : 'status-pending')));
                
                var priorityClass = item.PriorityScore >= 70 ? 'score-high' : (item.PriorityScore >= 40 ? 'score-medium' : 'score-low');
                
                html += '<li class="orderlist-item" data-index="' + index + '" data-order="' + item.OrderNumber + '">';
                html += '<div class="item-rank">' + (index + 1) + '</div>';
                html += '<div class="item-main">';
                html += '<div class="item-header">';
                html += '<a href="#" class="order-link">' + item.OrderNumber + ' - ' + item.ProductName + '</a>';
                html += '<span class="item-status ' + statusClass + '">' + item.Status + '</span>';
                html += '</div>';
                html += '<div class="item-details">';
                html += '<div class="detail-row">';
                html += '<span class="detail-label">Customer:</span>';
                html += '<span class="detail-value">' + item.CustomerName + '</span>';
                html += '<span class="detail-label">Category:</span>';
                html += '<span class="detail-value">' + item.CategoryName + '</span>';
                html += '</div>';
                html += '<div class="detail-row">';
                html += '<span class="detail-label">Order Date:</span>';
                html += '<span class="detail-value">' + app.util.formatDate(item.OrderDate) + '</span>';
                html += '<span class="detail-label">Qty:</span>';
                html += '<span class="detail-value">' + item.Quantity + '</span>';
                html += '</div>';
                html += '<div class="detail-row">';
                html += '<span class="detail-label">Unit Price:</span>';
                html += '<span class="detail-value">' + app.util.currency(item.UnitPrice) + '</span>';
                html += '<span class="detail-label">Total:</span>';
                html += '<span class="detail-value order-total">' + app.util.currency(item.OrderTotal) + '</span>';
                html += '</div>';
                html += '<div class="detail-row stats">';
                html += '<span>Shipping: ' + item.ShippingMethod + '</span>';
                if (item.Discount > 0) {
                    html += '<span>Discount: ' + app.util.currency(item.Discount) + '</span>';
                }
                html += '<span class="' + priorityClass + '">Priority: ' + item.PriorityScore + '</span>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</li>';
            });
            
            html += '</ol>';
        }
        
        html += '</div>';
        
        // Summary
        html += '<div class="orderlist-summary">';
        html += '<span>Showing ' + items.length + ' orders</span>';
        html += '</div>';
        
        return html;
    },
    
    attachEventHandlers: function() {
        var container = Ext.get(this.renderTo);
        if (!container) return;
        
        var self = this;
        var items = Ext.DomQuery.select('.orderlist-item', container.dom);
        Ext.each(items, function(item) {
            var itemEl = Ext.get(item);
            itemEl.on('click', function(e) {
                e.preventDefault();
                var index = itemEl.getAttribute('data-index');
                console.log('Item clicked:', index);
            });
            
            itemEl.on('mouseenter', function() {
                itemEl.addClass('item-hover');
            });
            
            itemEl.on('mouseleave', function() {
                itemEl.removeClass('item-hover');
            });
        });
    },
    
    doSearch: function() {
        var criteria = app.page.criteria || {};
        console.log('Searching with criteria:', criteria);
        
        var self = this;
        
        // Build query string
        var params = [];
        for (var key in criteria) {
            if (criteria.hasOwnProperty(key) && criteria[key] !== null && criteria[key] !== '') {
                params.push(encodeURIComponent(key) + '=' + encodeURIComponent(criteria[key]));
            }
        }
        
        var url = this.dataUrl + '?' + params.join('&');
        
        // Make AJAX request
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            success: function(response) {
                try {
                    self.data = Ext.decode(response.responseText);
                    self.render();
                    
                    // Update filter description
                    var filterEl = Ext.get('filterDescription');
                    if (filterEl && self.data.description) {
                        filterEl.update(self.data.description);
                    }
                } catch (e) {
                    console.error('Error parsing response:', e);
                }
            },
            failure: function() {
                console.error('Failed to fetch data');
            }
        });
    }
});
