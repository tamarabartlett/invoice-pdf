import moment from "moment";
import { jsPDF } from "jspdf";
import { program } from "commander";

const generateInvoice = () => {

  program.option('-n, --number <char>');
  program.option('-d, --date <char>');
  program.parse();
  const options = program.opts();

  let invoiceDate;
  let workEndDate;
  let workStartDate;

  if (options.date){
    invoiceDate = moment(options.date).format("MMM DD, YYYY");
    workEndDate = moment(options.date).subtract(4, "days").format("MMM DD, YYYY");
    workStartDate = moment(options.date).subtract(15, "days").format("MMM DD, YYYY");
  } else {
    invoiceDate = moment().format("MMM DD, YYYY");
    workEndDate = moment().subtract(4, "days").format("MMM DD, YYYY");
    workStartDate = moment().subtract(15, "days").format("MMM DD, YYYY");
  }

  let invoice = {
    number: options.number,
    date: invoiceDate
  };

  invoice.billFromName = "Tamara Bartlett";
  invoice.billFromAddress = process.env.ADDRESS;
  invoice.billFromState = process.env.STATE;
  invoice.billTo = process.env.COMPANY;
  invoice.billToAddress = process.env.BINST_ADDRESS;
  invoice.billToState = process.env.BINST_STATE;
  invoice.notes = `Hours worked ${workStartDate}-${workEndDate}`
  invoice.terms = "Payment for direct deposit; to be paid within 2 weeks.";

  invoice.item = "Software development and consulting";
  invoice.quantity = 40;
  invoice.rate = process.env.RATE;
  invoice.amount = invoice.quantity * invoice.rate;

  return invoice;
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const createNameAndAddress = (doc, invoiceData) => {
  doc.setFontSize(10)
  doc.setFont("helvetica","bold");
  doc.text(invoiceData.billFromName, 1, 1.5);
  doc.setFont("helvetica","normal");
  doc.text(invoiceData.billFromAddress, 1, 2);
  doc.text(invoiceData.billFromState, 1, 2.5);
}

const createInvoiceTitle =  (doc, invoiceData) => {
  doc.setFontSize(30)
  doc.setFont("helvetica","bold");
  doc.text("INVOICE", 15, 2);
  doc.setFontSize(10)
  doc.setFont("helvetica","normal");
  doc.text(`Invoice #: ${invoiceData.number.toString()}`, 15, 2.5);
  doc.text(`Date: ${invoiceData.date}`, 15, 3);
}

const createBillTo = (doc, invoiceData) => {
  doc.setFontSize(10)
  doc.setFont("helvetica","normal");
  doc.text("Bill To:", 1, 5);
  doc.setFont("helvetica","bold");
  doc.text(invoiceData.billTo, 1, 5.75);
  doc.text(invoiceData.billToAddress, 1, 6.1);
  doc.text(invoiceData.billToState, 1, 6.45);
}

const createBalanceDue = (doc, invoiceData) => {
  doc.setFontSize(12)
  doc.setFont("helvetica","bold");
  doc.text("Balance Due:", 12, 6)
  doc.text(`${formatter.format(invoiceData.amount)}`, 15, 6)
}

const createItemHeader = (doc) => {
  doc.setFontSize(10)
  doc.setFont("helvetica","normal");
  doc.text("Item", 1, 9)
  doc.text("Quantity", 10, 9)
  doc.text("Rate", 13, 9)
  doc.text("Amount", 16, 9)
  doc.setLineWidth(.05)
  doc.line(1, 9.2, 18, 9.2)
}

const createItemList= (doc, invoiceData) => {
  doc.setFontSize(10)
  doc.setFont("helvetica","normal");
  doc.text(invoiceData.item, 1, 10)
  doc.text(invoiceData.quantity.toString(), 10, 10)
  doc.text(`${formatter.format(invoiceData.rate)}`, 13, 10)
  doc.text(`${formatter.format(invoiceData.amount)}`, 16, 10)
}

const createTotals= (doc, invoiceData) => {
  doc.setFontSize(10)
  doc.setFont("helvetica","italic");
  doc.text("Subtotal: ", 12, 12)
  doc.text("Tax (0%): ", 12, 12.5)
  doc.text("Total: ", 12, 13)
  doc.setFont("helvetica","normal");
  doc.text(`${formatter.format(invoiceData.amount)}`, 16, 12)
  doc.text("$0.00 ", 16, 12.5)
  doc.text(`${formatter.format(invoiceData.amount)}`, 16, 13)
}

const createNotesAndTerms= (doc, invoiceData) => {
  doc.setFontSize(10)
  doc.setFont("helvetica","bold");
  doc.text("Notes:", 1, 15)
  doc.text("Terms:", 1, 18)

  doc.setFont("helvetica","normal");
  doc.text(invoiceData.notes, 1, 15.5)
  doc.text(invoiceData.terms, 1, 18.5)
}

const printInvoice = () => {
  let invoiceData = generateInvoice()

  const doc = new jsPDF({unit: 'cm'});

  createNameAndAddress(doc, invoiceData)
  createInvoiceTitle(doc, invoiceData)
  createBillTo(doc, invoiceData)
  createBalanceDue(doc, invoiceData)
  createItemHeader(doc)
  createItemList(doc, invoiceData)
  createTotals(doc, invoiceData)
  createNotesAndTerms(doc, invoiceData)

  doc.save(`invoice-${invoiceData.number}.pdf`);
}

const emailInvoice = () => {

}

printInvoice();