from django import forms

class PDFUploadForm(forms.Form):
    pdf_files=forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple':False}))
    def clean_pdf_files(self):
        pdf_files=self.cleaned_data.get('pdf_files')
        if pdf_files:
            for pdf in pdf_files:
                if not pdf.name.endswith('.pdf'):
                    raise forms.ValidationError('only pdf files allowed')
        return pdf_files
