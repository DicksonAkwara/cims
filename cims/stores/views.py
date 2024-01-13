from django.shortcuts import render, redirect
from django.http import JsonResponse
from stores.models import Supplier
from .forms import *
import json
from datetime import date,datetime, timedelta
from django.contrib import messages
from systemusers.models import CustomUser
from django.contrib.auth.decorators import login_required
from MedicalRecords.models import Services

# Create your views here.

@login_required
def storeindex(request):
    context={}   
    return render(request, 'dashboard/stores/store_index.html', context)


@login_required
def supplier(request):
    supp = Supplier.objects.all()
    if request.method=='POST':
        form = SupplierForm(request.POST)
        
    else:
        form=SupplierForm()
    context={
        'suppliers':supp,
        'form':form,
    }   
    return render(request, 'dashboard/stores/supplier.html', context)


@login_required
def addsupplier(request):
     if request.method=='POST':
        form = SupplierForm(request.POST)        
        if form.is_valid():
            form.save()
            suppname = form.cleaned_data.get('supplierName')            
            data = {'msg': f'{suppname} added successfully'}

        return JsonResponse(data,safe=False)


############### store items ########################
@login_required
def storeitems(request):
    stitems = DrugGeneralItem.objects.all().order_by('-itemCategory')
    if request.method=='POST':
        form = StoreItemForm(request.POST)
        
    else:
        form=StoreItemForm()
    context={
        'items':stitems,
        'form':form,
    }   
    return render(request, 'dashboard/stores/storeItem.html', context)


@login_required
def addstoreItem(request):
     if request.method=='POST':
        form = StoreItemForm(request.POST) 
             
        if form.is_valid():
            #form.save()   

            itname = form.cleaned_data.get('itemName')            
            price = form.cleaned_data.get('price')            
            strg = form.cleaned_data.get('strength')            
            cat = form.cleaned_data.get('itemCategory')            
            pkg = form.cleaned_data.get('package')
            desc = form.cleaned_data.get('itemDescp')

            ## add to store items 
            stitem=DrugGeneralItem()
            stitem.itemName=itname
            stitem.itemCategory=cat
            stitem.strength=strg
            stitem.package=pkg
            stitem.itemDescp=desc
            stitem.addedBy=CustomUser.objects.get(id=request.user.id)
            stitem.price=price
            stitem.save()

            itid=stitem.pk


            ## Adding to services
            serv=Services()
            serv.service_name=itname
            serv.service_point='pharmacy'
            serv.service_type='item'
            serv.normal_rate=price
            serv.scheme_rate=price            
            serv.staff=CustomUser.objects.get(id=request.user.id)
            serv.item_id=DrugGeneralItem.objects.get(itemId=itid)
            serv.status='active'
            serv.save()


            # add to substoreitems
            store=[]
            sql=''
            if(cat=='Pharmaceuticals' or cat=='Both'):
                sql=Store.objects.filter(item_category='Pharmaceuticals').distinct('store_Id') | Store.objects.filter(item_category='Both').distinct('store_Id')
            
            elif(cat=='Non-Pharmaceuticals'):
                sql=Store.objects.filter(item_category='Non-Pharmaceuticals').distinct('store_Id')

            for i in range(len(sql)):
                store.append(sql[i].store_Id)
            
            for j in store:
                subitem=SubStoreItem()
                subitem.itemCode=DrugGeneralItem.objects.get(itemName=itname)
                subitem.storeId=Store.objects.get(store_Id=j)
                subitem.itemBalance=0.0
                subitem.normalPrice=price
                subitem.specialPrice=price
                subitem.reorderLevel='100'
                subitem.addedBy=CustomUser.objects.get(id=request.user.id)
                subitem.save()
                print(j)
            data = {'msg': f'{itname} added successfully'}

        return JsonResponse(data,safe=False)


@login_required
def editstoreItem(request):
     if request.method=='POST':       
        itid=request.POST.get('itemid') 
        item = DrugGeneralItem.objects.get(itemId=itid)      
        form = StoreItemForm(request.POST, instance=item)
        if form.is_valid():
            form.save() 
            itemname = form.cleaned_data.get('itemName')           
            data = {'msg': f'{itemname} updated successfully'}

        return JsonResponse(data,safe=False)

############### store items ########################
@login_required
def stores(request):
    stores = Store.objects.all()
    if request.method=='POST':
        form = StoreForm(request.POST)
        
    else:
        form=StoreForm()
    context={
        'store':stores,
        'form':form,
    }   
    return render(request, 'dashboard/stores/stores.html', context)


@login_required
def addstores(request):
     if request.method=='POST':
        form = StoreForm(request.POST)
        today=date.today() 
              
        if form.is_valid():
            #form.save()
            stname = form.cleaned_data.get('store_name') 
            cat = form.cleaned_data.get('category')            
            itcat = form.cleaned_data.get('item_category')            
            svpoint = form.cleaned_data.get('servePoint')            
            manager = form.cleaned_data.get('storeManager') 
            stt = form.cleaned_data.get('status') 
            pp = form.cleaned_data.get('purpose') 
            staff=request.user.id

            sql=Store()
            sql.store_name=stname 
            sql.category=cat 
            sql.item_category=itcat 
            sql.servePoint=svpoint 
            sql.status=stt 
            sql.purpose=pp 
            sql.storeManager=CustomUser.objects.get(username=manager) 
            sql.dateAdded=today 
            sql.addedBy=CustomUser.objects.get(id=staff)
            sql.save() 
            stid=sql.pk            
            copystoreitems(itcat,stid,staff)

            data = {'msg': f'{stname} added successfully'}

        return JsonResponse(data,safe=False)
        

def copystoreitems(itcat,strid,staff):
    today=date.today()
    stid=strid
    itemcat=itcat
    sql=''
    if itemcat=='Pharmaceuticals':
        sql=DrugGeneralItem.objects.filter(itemCategory='Pharmaceuticals').order_by('itemId')

    elif itemcat=='Non-Pharmaceuticals':
        sql=DrugGeneralItem.objects.filter(itemCategory='Non-Pharmaceuticals').order_by('itemId')

    elif itemcat=='Both':
        sql=DrugGeneralItem.objects.all().order_by('itemId')

    if len(sql)>0:
        for i in range(len(sql)):
            cp=SubStoreItem()
            cp.itemCode=DrugGeneralItem.objects.get(itemId=sql[i].itemId)
            cp.storeId=Store.objects.get(store_Id=stid)
            cp.itemBalance=0
            cp.normalPrice=sql[i].price
            cp.specialPrice=sql[i].price
            cp.reorderLevel=100
            cp.dateAdded=today
            cp.addedBy=User.objects.get(id=staff)
            cp.save()



#############store allocation######################

@login_required
def storeallocate(request):
    stores = Store.objects.all()
    stores_all = StoreAllocation.objects.all()
    users = Store.objects.all()
    if request.method=='POST':
        form = StoreAllocationForm(request.POST)
        staff= request.POST.get('staffName')
        store= request.POST.get('storeName')
        status= request.POST.get('status')
        allby=request.user.id
        msg=''

        check=StoreAllocation.objects.filter(storeName=store,staffName=staff)
        if check:            
            msg='store already allocated'

        else:
            if form.is_valid():
                st_all=StoreAllocation()
                st_all.staffName=CustomUser.objects.get(id=staff)
                st_all.storeName=Store.objects.get(store_Id=store)
                st_all.status=status
                st_all.assignedBy=CustomUser.objects.get(id=allby)
                st_all.save()
                messages.success(request, f' Store allocated successfully')                  
                return redirect('storeallocate')
            else:
                messages.error(request, f' Store allocation Failed')      
    else:
        form=StoreAllocationForm()
    context={
        'store':stores,
        'allocate':stores_all,
        'users':users,
        'form':form,
    }   
    return render(request, 'dashboard/stores/store_allocate.html', context)


########### making order#########################
@login_required
def makeorder(request):
    stores = Store.objects.all() 
    userstore=StoreAllocation.objects.filter(staffName=request.user.id)   
    context={
        'stores':stores,
        'usstore':userstore        
    }   
    return render(request, 'dashboard/stores/store_order.html', context)


@login_required
def searchItem(request):
    if request.method == 'POST':
        data=[]        
        search_str = json.loads(request.body).get('searchText')        
        str = json.loads(request.body).get('str')  #store id      
        sql = SubStoreItem.objects.filter(itemCode__itemName__icontains=search_str,storeId=str)[0:5]  
        for i in range(len(sql)):
            data.append({
                'itid':sql[i].itemCode.itemId,
                'itname':sql[i].itemCode.itemName,
            })          
        return JsonResponse(data, safe=False)
    
    

@login_required
def itemdetails(request):
    if request.method == 'POST':
        data=[]        
        itid = json.loads(request.body).get('itid')        
        str = json.loads(request.body).get('str')  #store id      
        sql = SubStoreItem.objects.filter(itemCode=itid,storeId=str) 
        for i in range(len(sql)):
            data.append({
                'itid':sql[i].itemCode.itemId,
                'itname':sql[i].itemCode.itemName,
                'strg':sql[i].itemCode.strength,
                'pkg':sql[i].itemCode.package,
                'bal':sql[i].itemBalance,
                'price':sql[i].normalPrice,
                'itemcat':sql[i].itemCode.itemCategory,
            })          
        return JsonResponse(data, safe=False)


def confirmitemorder(request):
    if request.method=='POST':        
        now=datetime.now().timestamp()
        now_x=hex(int(now))
        hexa_now=now_x[2:] #removing the first two characters 
        items=json.loads(request.body)
        leng=len(items)
        if leng >0:
            for i in range(leng):
                sql=ItemOrder()
                sql.requestNo=hexa_now
                sql.order_type=items[i]['ort']
                sql.orderStore=Store.objects.get(store_Id=items[i]['strf'])
                sql.issueStore=Store.objects.get(store_Id=items[i]['strt'])
                sql.itemCode=DrugGeneralItem.objects.get(itemId=items[i]['itcode'])
                sql.requestQuantity=items[i]['qnt']
                sql.orderBy=CustomUser.objects.get(id=request.user.id)
                sql.urgency=items[i]['urg']
                sql.issueStatus='pending'
                sql.save()
            data={'msg':f'order sent successfully.Order number: ({hexa_now})'}
        return JsonResponse(data, safe=False)


def pendorders(request):
    if request.method=='POST':
        data=[]
        store=json.loads(request.body).get('str')
        #stid=Store.objects.get(store_Id=store)
        sql=ItemOrder.objects.filter(orderStore=store,issueStatus='pending').distinct('requestNo').order_by('-requestNo')
        if sql:
            for i in range(len(sql)):
                data.append({
                   'rqid':sql[i].requestNo
                })
    
        return JsonResponse(data, safe=False)
       

def fetchpendorders(request):
    if request.method=='POST':
        data=[]
        pdno=json.loads(request.body).get('pdno')
        #stid=Store.objects.get(store_Id=store)
        sql=ItemOrder.objects.filter(requestNo=pdno,issueStatus='pending').order_by('-orderNo')
        if sql:
            for i in range(len(sql)):
                data.append({
                   'rqdate':sql[i].orderDate,
                   'itname':sql[i].itemCode.itemName,
                   'qnt':sql[i].requestQuantity,
                   'str':sql[i].issueStore.store_name,
                   'staff':sql[i].orderBy.username,
                   'status':sql[i].issueStatus,
                })
    
        return JsonResponse(data, safe=False)  


##################### receiving stock ######################

@login_required
def receivestock(request):
    #stores = Store.objects.all().order_by('store_name') 
    supp = Supplier.objects.all().order_by('supplierName')     
    userl=request.user.id  
    #print(userl)
    userstore=StoreAllocation.objects.filter(staffName=userl,storeName__category='Main store')   
    context={
        #'stores':stores,
        'supp':supp,
        #'items':item,
        'usstore':userstore        
    }   
    return render(request, 'dashboard/stores/store_receive.html', context)

@login_required
def loaditems(request):
    if request.method=='POST':
        data=[]
        stid=json.loads(request.body).get('stid')
        items = SubStoreItem.objects.filter(storeId=stid).order_by('itemCode')
        for i in range(len(items)):
            data.append({
                #'id':items[i].itemCode.itemId,
                'itname':items[i].itemCode.itemName,
            })
        return JsonResponse(data, safe=False)

def confrecstock(request):  
    context={           
    }   
    return render(request, 'dashboard/stores/confrecstock.html', context)



@login_required
def receivestockitem(request):
    if request.method=='POST': 
             
        delivery=StoreDelivery()        
        delivery.supplierId =Supplier.objects.get(supplierName=json.loads(request.body).get('supplier')) 
        delivery.itemId = DrugGeneralItem.objects.get(itemId=json.loads(request.body).get('itemid'))
        delivery.storeId = Store.objects.get(store_Id=json.loads(request.body).get('storerec'))
        delivery.batchNo = json.loads(request.body).get('batchno') 
        delivery.packageUnit = json.loads(request.body).get('pkgUnit')
        delivery.packageCount =json.loads(request.body).get('pkgcount') 
        delivery.noItemsInPackage =json.loads(request.body).get('itmperpkg') 
        delivery.totalItems=json.loads(request.body).get('dlvttitem')
        delivery.packagePrice =json.loads(request.body).get('pkgprice') 
        delivery.costperitem =json.loads(request.body).get('itemprice') 
        delivery.expiryDate = json.loads(request.body).get('expdate')
        delivery.deliverlyNoteNo =json.loads(request.body).get('dlvno')
        delivery.lpoNo =json.loads(request.body).get('lpono')
        delivery.deliverlyBy = json.loads(request.body).get('dlvby')
        delivery.inspector = json.loads(request.body).get('inspector')
        delivery.receivedDate = json.loads(request.body).get('dldate')
        delivery.receiveStatus = 'pending'      
        delivery.sellprice = json.loads(request.body).get('itemprice')      
        delivery.receivedBy =CustomUser.objects.get(id=request.user.id)      
        delivery.save()

        data = {'msg':'Item Received successfully'}
    return JsonResponse(data,safe=False)


@login_required
def pend_delv_note(request):
    if request.method=='POST':
        data=[] 
        str=json.loads(request.body).get('str') 
        user=request.user.id                    
        sql=StoreDelivery.objects.filter(receiveStatus='pending',storeId=str,receivedBy=user).order_by('deliverlyNoteNo').distinct('deliverlyNoteNo')
        for i in range(len(sql)):
            data.append({
                'dlvno':sql[i].deliverlyNoteNo,
            })
        return JsonResponse(data, safe=False)



@login_required
def refreshreclist(request):
    if request.method =='POST': 
        delv=json.loads(request.body).get('delv')                  
        sql=StoreDelivery.objects.filter(receiveStatus='pending',deliverlyNoteNo=delv).order_by('itemId__itemName')         
        data=[]        
        for i in range(len(sql)):
            data.append({
                'dlid':sql[i].deliveryId,
                'itemId':sql[i].itemId.itemId,
                'spname':sql[i].supplierId.supplierName,
                'itname':sql[i].itemId.itemName,
                'pkgcount':sql[i].packageCount,
                'dvno':sql[i].deliverlyNoteNo,
                'lpono':sql[i].lpoNo,
                'dvprice':sql[i].packagePrice,
                'exdate':sql[i].expiryDate,
                'batch':sql[i].batchNo,
                'pkgunit':sql[i].packageUnit,
                'itperpkg':sql[i].noItemsInPackage,
                'ttitems':sql[i].totalItems,
                'ctperitem':sql[i].costperitem,
                'dlby':sql[i].deliverlyBy,
                'dldate':sql[i].receivedDate,
                'stid':sql[i].storeId.store_Id,
              
            })

        return JsonResponse(data, safe=False)


@login_required
def confirmreclist(request):
    if request.method=='POST':
        bill=json.loads(request.body)
        pb=bill["delidarray"] #it is the only main item in the dictionary          
        billLength=len(pb) 
        if billLength >0 :      
            for i in range(billLength):
                stid=pb[i]["stid"]
                delconf = StoreDelivery.objects.get(deliveryId = pb[i]["dlid"])                
                delconf.receiveStatus='confirmed' 
                delconf.save()

                #update item balance
                itembalance=SubStoreItem.objects.get(itemCode=pb[i]["itid"],storeId=stid) ## get the specific store to update the balnces
                itembalance.itemBalance +=float(pb[i]["ttit"]) 
                itembalance.save()
                #also generate an invoice for the delivery

        data={'msg':'confirmed successfully'}
        return JsonResponse(data, safe=False)



@login_required
def amendstockitem(request):
    if request.method=='POST': 
            
        delivery=StoreDelivery.objects.get(deliveryId=request.POST.get('dvid'))   

        delivery.supplierId =Supplier.objects.get(supplierName=request.POST.get('supplier')) 
        delivery.itemId = DrugGeneralItem.objects.get(itemId=request.POST.get('dlvitem'))
        delivery.batchNo = request.POST.get('batchno') 
        delivery.packageUnit = request.POST.get('pkgUnit')
        delivery.packageCount =request.POST.get('pkgcount') 
        delivery.noItemsInPackage =request.POST.get('itmperpkg') 
        delivery.totalItems=request.POST.get('dlvttitem')
        delivery.packagePrice =request.POST.get('pkgprice') 
        delivery.costperitem =request.POST.get('itemprice') 
        delivery.expiryDate = request.POST.get('expdate')
        delivery.deliverlyNoteNo =request.POST.get('dlvno')
        delivery.deliverlyBy = request.POST.get('dlvby')
        delivery.receivedDate = request.POST.get('dldate')
        delivery.receiveStatus = 'pending' 
        delivery.sellprice = request.POST.get('itemprice')      
        delivery.save()
        #update item balance in main store during confirm
        data = {'msg':'updated successfully'}
    return JsonResponse(data,safe=False)

@login_required
def rmitem(request):
    if request.method=='POST':
        dlid=json.loads(request.body).get('dlid')
        delivery=StoreDelivery.objects.get(deliveryId=dlid) 
        delivery.receiveStatus = 'cancelled' 
        delivery.save()
        return JsonResponse({'data':'success'},safe=False)


## issue items from delivery batch no subtract both batch amount and total amount from main store


########### stock issue #########################

@login_required
def issuestock(request):
    stores = Store.objects.all().order_by('-category') 
    userl=request.user.id    
    userstore=StoreAllocation.objects.filter(staffName=userl)   
    context={
       'stores':stores,       
       'userstore':userstore,       
    }   
    return render(request, 'dashboard/stores/store_issue.html', context)

@login_required
def fetchrqitems(request):
    if request.method=='POST':
        data=[]
        pdno=json.loads(request.body).get('rqno')
        stid=json.loads(request.body).get('stid')
        #stid=Store.objects.get(store_Id=store)
        sql=ItemOrder.objects.filter(requestNo=pdno,issueStatus='pending')
        if sql:
            itbal=0
            for i in range(len(sql)):
                itid=sql[i].itemCode.itemId
                #fetch itbalance in given store
                bal=SubStoreItem.objects.filter(itemCode=itid,storeId=stid).values('itemBalance')
                itbal=bal[0]['itemBalance']

                data.append({
                   'orno':sql[i].orderNo,
                   'date':sql[i].orderDate,
                   'rqno':sql[i].requestNo,
                   'itname':sql[i].itemCode.itemName,
                   'itid':sql[i].itemCode.itemId,
                   'rqnt':sql[i].requestQuantity,
                   'rqby':sql[i].orderBy.username,
                   'avqnt':itbal
                })
                                
        return JsonResponse(data, safe=False)

@login_required
def confirm_os(request):
    if request.method=='POST':
        data=[]
        entno=json.loads(request.body).get('entno')
        sql=ItemOrder.objects.get(orderNo=entno)
        sql.issueStatus='OS'
        sql.save()
        data={'msg':'saved'}

        return JsonResponse(data,safe=False)

@login_required
def confirm_issue(request):
    if request.method=='POST':
        data=[]
        today=datetime.now()

        stf=json.loads(request.body).get('stf')
        stt=json.loads(request.body).get('stt')
        entno=json.loads(request.body).get('entno')
        itid=json.loads(request.body).get('itid')
        isqnt=json.loads(request.body).get('isqnt')
        isto=json.loads(request.body).get('isto')

        sql=ItemOrder.objects.get(orderNo=entno)
        sql.issueStatus='issued'
        sql.issueStore=Store.objects.get(store_Id=stt)
        sql.issueQuantity=isqnt
        sql.issueDate=today
        sql.issueBy=CustomUser.objects.get(id=request.user.id)
        sql.issueTo=isto        
        sql.save()
        #subtract to issuing store
        subt=SubStoreItem.objects.get(itemCode=itid,storeId=stt)
        subt.itemBalance -=float(isqnt)
        subt.save()
        #add to receiving store
        addt=SubStoreItem.objects.get(itemCode=itid,storeId=stf)
        addt.itemBalance +=float(isqnt)
        addt.save()

        data={'msg':'item issued'}

        return JsonResponse(data,safe=False)


################### stock prices ##################################

@login_required
def stockprices(request):
    sstores=Store.objects.filter(category='Sub Store').order_by('store_name')
    context={
        'substores':sstores
    }   
    return render(request, 'dashboard/stores/stockprices.html', context)


@login_required
def fetchprices(request):
    if request.method=='POST':
        data=[]
        itn=json.loads(request.body).get('itname')
        stid=json.loads(request.body).get('stid')
        sql=SubStoreItem.objects.filter(storeId=stid,itemCode__itemName__icontains=itn).order_by('itemCode__itemName')[0:10]
        if sql:
            for i in range(len(sql)):
                data.append({
                    'entn':sql[i].entryNo,
                    'itname':sql[i].itemCode.itemName,
                    'itcat':sql[i].itemCode.itemCategory,
                    'np':sql[i].normalPrice,
                    'sp':sql[i].specialPrice,
                    'staff':sql[i].addedBy.username,
                })
        return JsonResponse(data, safe=False)

@login_required
def changeprice(request):
    if request.method=='POST':
        data=[]
        entno=json.loads(request.body).get('ent')
        np=json.loads(request.body).get('np')
        sp=json.loads(request.body).get('sp')

        sql=SubStoreItem.objects.get(entryNo=entno)
        sql.normalPrice=np
        sql.specialPrice=sp
        sql.save()
        data={'msg':'Price updated'}

        return JsonResponse(data,safe=False)


################### stock reconciliation #######################



@login_required
def reconcile(request):
    sstores=StoreAllocation.objects.filter(staffName=request.user.id).order_by('storeName__store_name')
    context={
        'stores':sstores
    }   
    return render(request, 'dashboard/stores/stock_reconcile.html', context)


@login_required
def reconcile_item(request):
    if request.method=='POST':
        data=[]
        itid=json.loads(request.body).get('itid')
        stid=json.loads(request.body).get('stid')
        bal=json.loads(request.body).get('itbal')

        itembalance=SubStoreItem.objects.get(itemCode=itid,storeId=stid) ## get the specific store to update the balnces
        itembalance.itemBalance=float(bal) 
        itembalance.save()

        rec=StoreReconciliation()
        rec.storename=Store.objects.get(store_Id=stid)
        rec.reconcileBy=CustomUser.objects.get(id=request.user.id)
        rec.amount=bal
        rec.itname=DrugGeneralItem.objects.get(itemId=itid)
        rec.save()

        data={'msg':'Balance updated'}

        ###add into reconciliation report

        return JsonResponse(data,safe=False)

#######################pdf test#########################
from django.http import FileResponse
from reportlab.pdfgen import canvas

def generate_pdf(request):
    response = FileResponse(generate_pdf_file(), 
                        as_attachment=True, 
                        filename='book_catalog.pdf')
    return response
 
 
def generate_pdf_file():
    from io import BytesIO
 
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
 
    # Create a PDF document
    books = Store.objects.all()
    p.drawString(100, 750, "Book Catalog")
 
    y = 700
    for book in books:
        p.drawString(100, y, f"Title: {book.store_Id}")
        p.drawString(100, y - 20, f"Author: {book.store_name}")
        p.drawString(100, y - 40, f"Year: {book.storeManager}")
        y -= 60
 
    p.showPage()
    p.save()
 
    buffer.seek(0)
    return buffer