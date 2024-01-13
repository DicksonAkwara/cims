/*const data = {
    labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
    datasets: [
      {
        labels:'trial dataset',
        data: [20,5, 15, 45, 5],
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Area fill color
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        borderWidth: 1, // Line width
        fill: 'start', // Fill area under the line
        tension: 0, 
      },
    ],
  };
  
  // Create and render the line graph
  new Chart(document.getElementById('myChart'), {
    type: 'line',
      data: data,
      options: {
        legend:{
          labels:{
            color:'white'
          }
        },
      }
  });

  



  //second chart

  const renderChart=(vcount,days,ctitle)=>{
    const ctx2 = document.getElementById('myChart2');  
    new Chart(ctx2, {
        type: 'bar',
        data: {
        labels: days,
        datasets: [{
            label: ctitle,
            data: vcount,
            backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 230, 0.2)',
                  'rgba(255, 176, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 245, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(155, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(200, 95, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
  }
  const getChatData=()=>{
    vcount=[]
    days=[]
    var rnge;
    fetch('/sysadmin/chartdata/')
    .then(res=>res.json())
    .then(results=>{
      var jdata=results;

      jdata.forEach(item=>{
        days.push(Object.keys(item));
        vcount.push(parseInt(Object.values(item)));

        rnge=item['date_range'];
      })

      days.pop();//removing the last element in that array i.e //date _range
      renderChart(vcount,days,rnge);
    })
  }
  document.onload=getChatData();




  //third chart

const ctx3 = document.getElementById('myChart3');

new Chart(ctx3, {
   type: 'doughnut',
   data: {
   labels: ['Red','Yellow','Blue', 'Purple', 'Green', 'indigo'],
   datasets: [{
       label: 'no of Votes',
       data: [12, 20, 3, 5, 20, 3],
       backgroundColor: [
             'rgba(255, 99, 132, 0.2)',
             'rgba(54, 162, 230, 0.2)',
             'rgba(255, 176, 86, 0.2)',
             'rgba(75, 192, 192, 0.2)',
             'rgba(153, 102, 245, 0.2)',
             'rgba(255, 159, 64, 0.2)'
         ],
         borderColor: [
             'rgba(255,99,132,1)',
             'rgba(54, 162, 235, 1)',
             'rgba(255, 206, 86, 1)',
             'rgba(75, 192, 192, 1)',
             'rgba(153, 102, 255, 1)',
             'rgba(255, 159, 64, 1)'
         ],
       borderWidth: 1
     }]
   },
   options: {
    title:{
      display:true,
      text:'Patient Visits'
    },
   }
 });

 */

 const getChatData=()=>{
  var vst
  var cash
  fetch('/sysadmin/chartdata/')
    .then(res=>res.json())
    .then(results=>{
      var visits=results['visits']
      var cpcount=results['cashcount']
      var spcount=results['schemecount']
      var tcash=results['tcash']
      var tscheme=results['tscheme']
      var scounts=results['sc_counts']// each scheme count
      var vtype_count=results['vtype_count']
      
      var cash=tcash[0]['tcash'];
      var sch=tscheme[0]['tscheme'];
      $('#ttcash').text(cash); 
      $('#ttscheme').text(sch);
      $('#ttrevn').text(parseInt(cash+sch));

      
      $('#tlab').text(results['lab']); 
      $('#trad').text(results['rad']);  
      $('#tphar').text(results['phar']);

      $('#tadm').text(results['admcount']); 
      $('#tocc').text(results['occp']);  
      $('#treff').text(results['reff']);
      
      var np=results['nvisit'];
      var rp=results['rvisit'];

      $('#npat').text(np);
      $('#rvpat').text(rp);
      $('#ttpat').text(parseInt(np+rp));
     
      
      // visits bar graph
      vcount=[]
      days=[]
      var rnge;


      visits.forEach(item=>{
        days.push(Object.keys(item));
        vcount.push(parseInt(Object.values(item)));
        rnge=item['date_range'];
      })

      document.querySelector('#chart_period').innerHTML=rnge;

      days.pop();//removing the last element in that array i.e //date _range
      const ctx2 = document.getElementById('myChart2');

      new Chart(ctx2, {
          type: 'bar',
          data: {
          labels: days,
          datasets: [{
              label: 'Patients per Day',
              data: vcount,
              backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 230, 0.2)',
                    'rgba(255, 176, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 245, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(155, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(200, 95, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
          }
        });


      
        //cash and scheme patients
        pmode=[]
        pmcount=[]

        cpcount.forEach(item=>{
          pmode.push(Object.keys(item));
          pmcount.push(parseInt(Object.values(item)));
        })
        spcount.forEach(item=>{
          pmode.push(Object.keys(item));
          pmcount.push(parseInt(Object.values(item)));
        })

        const ctx3 = document.getElementById('myChart3');

        new Chart(ctx3, {
          type: 'doughnut',
          data: {
          labels: pmode,
          datasets: [{
              label: '',
              data: pmcount,
              backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 230, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                ],
              borderWidth: 1
            }]
          },
          options: {
            title:{
              display:true,
              text:'Scheme vs Non-Scheme patients'
            },
          }
        });


        //new and revisit patients
          vtype=[]
          vtcount=[]
  
          vtype_count.forEach(item=>{
            vtype.push(Object.keys(item));
            vtcount.push(parseInt(Object.values(item)));
          })

          

          const ctx1 = document.getElementById('myChart');

          new Chart(ctx1, {
            type: 'doughnut',
            data: {
            labels: vtype,
            datasets: [{
                label: '',
                data: vtcount,
                backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 230, 0.2)',
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                  ],
                borderWidth: 1
              }]
            },
            options: {
              title:{
                display:true,
                text:'new and revisits'
              },
            }
          });
  


     })
 }

 document.onload=getChatData();

