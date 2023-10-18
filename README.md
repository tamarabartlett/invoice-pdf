# invoice-pdf

source localenv; node src/create_invoice.js -n <INVOICE-NUMBER> -d <DATE yyyymmdd> (-ne for no email) (-a <AMOUNT TO SUBTRACT FROM INVOICE>)

# Create localenv
export ADDRESS=""
export STATE=""
export COMPANY=""
export BINST_ADDRESS=""
export BINST_STATE=""
export RATE=
