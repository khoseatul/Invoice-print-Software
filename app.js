
var app = (function(){
    //private fun
    var products = {};
     return {
          init: function(){              
               app.getProducts();
          },
          getProducts: async function(){               
              const response = await fetch("./product.json");
              const data = await response.json();
              products = data;
              app.bindProductDropdown(data);
          },
          bindProductDropdown: function(products){
            $("#product-select").find("option").remove();
             for (key in products) {
                 let item = `<option value="${key}">${key}</option>`;
                 $("#product-select").append(item);
             }
          },  
          printRecipt: function(){  

            var name = $("#product-select option:selected").val();
            var weight = $("#weight").val();
            var mfgdate = $("#mfg").val();
            var mrp = $("#mrp").val();

             // Generate receipt HTML
             const receiptHTML = app.generateReceiptHTML(products[name],name,weight,mfgdate,mrp,products[name].Ingredients);
             // Open new window and write HTML
             const printWindow = window.open('', '_blank');
             //printWindow.document.write(receiptHTML);
             printWindow.document.write(`
                        <html>
                            <head>
                                <title>Receipt</title>
                                <style>
                                    .wrapper{
                                        width:50%;
                                        margin:0 auto;
                                        display:block;
                                    }
                                    table, th, td {
                                        border: 1px dashed black;
                                        border-collapse: collapse;
                                        padding: 2px 5px;
                                        text-align: leftr;
                                        margin: 0 auto; 
                                        width: 100%;
                                        font-size: 14px;
                                        
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="wrapper">
                                  ${receiptHTML}                                  
                                </div>
                               <script>
                                   document.getElementById("btnPrint").addEventListener("click", function(){
                                    window.print();
                                    
                                   });                                
                               </script> 

                            <!--<script type="module" src="print.js"></script>-->

                            </body>
                         </html>`);
             // Close print window after printing
             printWindow.document.addEventListener('DOMContentLoaded',function() {
                //printWindow.print();
                //printWindow.close();
             });
             printWindow.webContents.print({ silent: false, printBackground: true });


          },
          generateReceiptHTML:function(product,name,weight,mfgdate,mrp,ingradients) {
            let html = '';

            html += '<style>'; // Start of the <style> block
            html += 'body { font-size: 10pt; }'; // Adjust font size
            html += 'p { line-height: 1; margin: 5px 0; }'; // Adjust line height and margin for paragraphs
            html += '@page { size:6in ; margin:0; }'; // Set page size and margins
            html += '</style>'; // End of the <style> block
            html += '<style>'; // Start of the <style> block
            html += '.center-h4 { text-align: center;margin-top: 10px;margin-bottom:10px;display: flex;align-items: center;justify-content: flex-start;font-size: 12px;}'
            html += '.info { text-align:left;}'
            html += '.logo { vertical-align: middle; margin-right: 5px; }';
            html += '.veg-symbol { width: 20px; height: 20px; }'; // Adjust veg symbol style
            html += '.additional-info { text-align: left; }'
            
            html += 'p { line-height: ; 0.1}'; // CSS rule to reduce the gap between lines of text
            html += '</style>'; 

            html += '<div><h4 class="center-h4"><img src="assets/veg.png" style="margin-right:5px;" alt="Vegetarian Symbol" class="veg-symbol"> SHREE  LAXMI  WAFFERS  AND  NAMKEEN</h4></div>'; 
            html += '<p><strong>Product Name: ' + name + '</strong></p>';
            html += '<table>';
            html += `<tr>
                        <th style="text-align:left">Nutritional values per 100 g (Appro)** </th>
                        <th>Value</th>
                    </tr>`;

            for(key in product){ 
                if(key != 'Ingredients'){
                    html += `<tr>
                        <td>${key}</td>
                        <td style="text-align:right">${product[key]}</td>
                    </tr>`;
                }
            }
            html += '</table>';


            html += '<div class="info">'
            html += '<p>Weight: ' + weight + 'g</p>';
            html += '<p>Manufacturing Date: ' + mfgdate + '</p>';
            html += '<p>MRP: Rs. ' + mrp + '</p>';
            html += '<p>Ingradients: ' + ingradients + '</p>';
            html += '</div>';

            html += '<div class="additional-info">';
            html += '<p>Made In India'
            html += '<p>Inclusive of all taxes</p>';
            html += '<p>Best Before 60 Days of Mfg.Date</p>';
            html += '<p>Customer Care No: 9767675702</p>';
            html += '<p>FSSAI Lic No.: 215230490 02950</p>';
            html += '</div>';
            html += `<div style="display:block;text-align:center;margin:20px auto;">
            <style>
                @media print {
                    .btnPrint-container {
                        display: none;
                    }
                }
            </style>
            <div class="btnPrint-container">
                <input type="button" value="Print" id="btnPrint" class="btnPrint">
            </div>
            </div>`;
            html += '<div>';
        
            return html;
        }
               

        
     
     }
})();

$(document).ready(function(){
     app.init();
});

$(document).on("click", "#gotoPrint", function(){
     app.printRecipt();
});