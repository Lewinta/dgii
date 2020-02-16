import frappe

from frappe.model.naming import make_autoname

def autoname(self, event):
	self.name = make_autoname("FACT-.#####")
	self.ncf = make_autoname(self.naming_series)