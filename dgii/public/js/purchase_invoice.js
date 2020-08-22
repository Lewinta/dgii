frappe.ui.form.on("Purchase Invoice", {
	
	refresh: frm => {
		frappe.db.get_value(
			"DGII Settings", 
			"DGII Settings",
			"is_tax_free", ({is_tax_free}) => frm.doc.is_tax_free = 1);
	},
	validate: frm => {
		frm.trigger("bill_no");
	},
	bill_no: frm => {
		let {bill_no} = frm.doc;

		if (!bill_no)
			return

		if (bill_no.length != 11 && bill_no.length != 13){
			frappe.msgprint("El numero de comprobante debe contener 11 " +
				"digitos, favor verificar."
			)
			frappe.validated = false;
		}
		
		frm.set_value("bill_no", bill_no.trim().toUpperCase())
	},
	taxes_and_charges: frm => {
		if (!frm.doc.taxes_and_charges)
			return 
		setTimeout(function() {
			if(frm.doc.is_tax_free){
				if(frm.doc.items && frm.doc.items[0]){
					let expense_acct = frm.doc.items[0].expense_account;
					let tax = frm.doc.taxes[0];
					frappe.run_serially([
						() => frappe.model.set_value(tax.doctype, tax.name, "account_head", expense_acct),
						() => frappe.timeout(1),
						() => frappe.model.set_value(tax.doctype, tax.name, "rate", 18),
						() => frm.refresh_fields("taxes"),
					])
				}
				else {
					frappe.throw("Favor verificar la cuenta de gasto del servicio seleccionado")
				}
			}
		}, 1000);
	}
});