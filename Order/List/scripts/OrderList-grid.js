/*
 * OrderList-grid.js - Grid functionality for Order Details
 * Sample application with randomized mock data
 */

app.OrderListPage.Grid = (function() {
    var grid, gridDS, gridDialog;

    var shippingTemplate = new Ext.Template(
        '<table>' +
        '<tr><td>{CustomerName}</td></tr>' +
        '<tr><td>{ShippingAddress}</td></tr>' +
        '<tr><td>{ShippingCity}, {ShippingState} {ShippingPostalCode}</td></tr>' +
        '<tr><td>{ShippingPhone}</td></tr>' +
        '</table>'
    );
    shippingTemplate.compile();

    function formatProductTitle(record) {
        var data = record.data || record;
        var parts = [];
        
        if (data.ProductSku) parts.push('[' + data.ProductSku + ']');
        if (data.ProductName) parts.push(data.ProductName);
        
        var s = parts.join(' ');

        if (!s || s.trim() === '') {
            s = '<div class="EmptyProductTitle">No Product Title</div>';
        }

        if (data.DetailUri) {
            s = '<a href="' + data.DetailUri + '" onclick="return app.dialogs.openAnchorInWindow(this, event, \'_orderDetail\');" title="View details">' + s + '</a>';
        }

        return s;
    }

    function renderProduct(value, p, record) {
        var data = record.data || record;
        
        return app.html.tableMarkup({
            cls: 'Product SubTable',
            items: [[{
                colspan: 2,
                cls: 'ProductTitle',
                html: formatProductTitle(record)
            }], 
            app.isNotEmpty(data.OrderNumber) ? [{
                cls: 'Label',
                html: 'Order:'
            }, data.OrderNumber] : null, 
            app.isNotEmpty(data.CategoryName) ? [{
                cls: 'Label',
                html: 'Category:'
            }, data.CategoryName] : null, 
            app.isNotEmpty(data.Quantity) ? [{
                cls: 'Label',
                html: 'Qty:'
            }, data.Quantity] : null, 
            app.isNotEmpty(data.TrackingNumber) ? [{
                cls: 'Label',
                html: 'Tracking:'
            }, data.TrackingNumber] : null].stripNulls()
        });
    }

    function renderShipping(value, p, record) {
        return shippingTemplate.apply(record.data || record);
    }

    function renderQuantity(value, p, record) {
        return value + ' units';
    }

    function renderPrice(value, p, record) {
        if (value) {
            return app.util.currency(value);
        }
        return '';
    }

    var Impl = function() {
        this.data = null;
        this._orderNumber = '';
    };

    Ext.extend(Impl, Ext.util.Observable, {
        setupGrid: function() {
            if (grid) return grid;

            gridDS = new Ext.data.JsonStore({
                url: 'OrderData.ashx',
                root: 'rows',
                totalProperty: 'totalCount',
                fields: [
                    'Id', 'OrderNumber', 'ProductName', 'ProductSku', 'CategoryName',
                    'Quantity', 'UnitPrice', 'LineTotal', 'CustomerName', 'CustomerEmail',
                    'ShippingAddress', 'ShippingCity', 'ShippingState', 'ShippingPostalCode',
                    'ShippingPhone', 'TrackingNumber', 'DetailUri'
                ]
            });

            var cm = new Ext.grid.ColumnModel({
                defaultSortable: true,
                columns: [{
                    id: 'product',
                    header: 'Product',
                    dataIndex: 'ProductName',
                    hideable: false,
                    renderer: renderProduct,
                    width: 215
                }, {
                    id: 'unitPrice',
                    align: 'right',
                    header: 'Unit Price',
                    dataIndex: 'UnitPrice',
                    renderer: renderPrice,
                    width: 80
                }, {
                    id: 'qty',
                    align: 'right',
                    header: 'Qty',
                    dataIndex: 'Quantity',
                    renderer: renderQuantity,
                    width: 60
                }, {
                    id: 'lineTotal',
                    align: 'right',
                    header: 'Line Total',
                    dataIndex: 'LineTotal',
                    renderer: renderPrice,
                    width: 80
                }, {
                    id: 'shipping',
                    header: 'Shipping',
                    dataIndex: 'CustomerName',
                    renderer: renderShipping,
                    width: 140
                }]
            });

            gridDS.setDefaultSort('LineTotal', 'desc');

            grid = new app.grid.GridPanel({
                id: 'order-details-grid',
                store: gridDS,
                cm: cm,
                autoSizeColumns: false,
                stateId: 'orderdetails',
                stateful: false,
                objectType: 'items',
                pageSize: 20,
                trackMouseOver: true,
                width: 580,
                height: 400,
                border: true
            });

            return grid;
        },

        doShowOrderDetails: function(data, orderNumber) {
            this.data = data;
            this._orderNumber = orderNumber;

            if (!gridDialog) {
                gridDialog = new Ext.Window({
                    autoCreate: true,
                    modal: true,
                    width: 620,
                    height: 450,
                    shadow: true,
                    minWidth: 300,
                    minHeight: 300,
                    proxyDrag: true,
                    closeAction: 'hide',
                    tbar: new Ext.Toolbar({
                        cls: 'boldToolbar',
                        items: ['->', {
                            text: 'Excel',
                            tooltip: 'Export to Excel',
                            iconCls: 'icon-excel',
                            handler: this.openInExcel.createDelegate(this)
                        }]
                    }),
                    buttons: [{
                        text: 'Close',
                        handler: function() { gridDialog.hide(); }
                    }],
                    listeners: {
                        show: this.loadGridData,
                        scope: this
                    },
                    layout: 'fit',
                    items: [this.setupGrid()]
                });
            }

            gridDialog.setTitle(this.getTitle(this.data));
            gridDialog.show();
            gridDialog.center();
        },

        getTitle: function(data) {
            return 'Order Details for ' + (data.OrderNumber || this._orderNumber);
        },

        openInExcel: function() {
            Ext.Msg.alert('Export', 'Export to Excel is not available in this sample application.');
        },

        loadGridData: function() {
            var data = {
                OrderNumber: this._orderNumber,
                Action: 'OrderDetails'
            };
            Ext.apply(gridDS.baseParams, data);

            gridDS.load({ params: { start: 0, limit: 20 } });
        },

        __dummy: null
    });

    return new Impl();
})();
