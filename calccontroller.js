
// Classe para acessar as funções da calculadora.
// o _ serve para deixar os atributos privados , podendo ser usados apenas pela mesma class.
// por convenção ou não kk
// criando get e set para realizar encapsulamento 
// toda vez que se repetir um comando é melhor criar um método

class CalcController {

  constructor (){

  this._audio = new Audio('click.mp3') // som da calc 
  this._audioOnOff = false;  
  this._lastOperator = ''
  this._lastNumber = '' 
  this._operation = [];  
  this._locale= 'pt-Br';  
  this._displayCalcEl=document.querySelector('#display')
  this._timeEl=document.querySelector('#time')
  this._dateEl=document.querySelector('#date')

  this._currentDate;
  this.initialize();
  this.setDisplayDateTime(); // chamando a função para aparecer mais rápido na tela
  this.initButtonsEvents();
  this.initKeyBoard();  
  
    }

    copyToClipBoard(){ // usar o ctrl+c 

      let input = document.createElement('input')

      input.value = this.displayCalc

      document.body.appendChild(input)

      input.select();

      document.execCommand('copy')

      input.remove();
    }

    pastFromClipBoard(){ // usar o  ctrl+v 


      document.addEventListener('paste', e =>{

       let text = e.clipboardData.getData('Text')


       this.displayCalc = parseFloat(text)

      })

    }



    initialize(){ 


      setInterval(() =>{ // faz a hora e data atualizar automaticamente
 
        this.setDisplayDateTime()


      },1000)  
      this.setLastNumberToDisplay()
      this.pastFromClipBoard()

      document.querySelectorAll('.btn-ac').forEach(btn=>{ //ativar som ca calculado

        btn.addEventListener("dblclick", e =>{  //ativar som ca calculado

          this.toggleAudio();



        })



      })



    }
    toggleAudio(){ //ativar som da calculadora

      this._audioOnOff = !this._audioOnOff


    }

    playAdio(){  //ativar som da calculadora

      if(this._audioOnOff){

        this._audio.currentTime = 0
        this._audio.play()

      }


    }




    initKeyBoard(){ // eventos de teclado

      document.addEventListener('keyup', e =>{
        this.playAdio()

        switch (e.key){

          case 'Escape' :
          
          this.clearAll();
  
          break;
  
          case 'Backspace' :
  
          this.clearEntry();
  
          break;
  
          case '+' :
            this.addOperation(e.key)
          break;
  
          case '-' :
            this.addOperation(e.key)
          break;
  
          case '/' :
            this.addOperation(e.key)
          break;
  
          case '*' :
            this.addOperation(e.key)
          break;
  
          case '%' :
            this.addOperation(e.key)
          break;
  
          case 'Enter' :
          case '=' :
            this.calc()
          break;
  
          case '.' :
          case ',' :
            this.addDot()
          break;
  
          case '0':
          case '1':
          case '2':  
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':  
          case '8':
          case '9': 
          this.addOperation(parseInt(e.key)) //add os numeros no array convertendo eles para numero, pois sairam como string.
             break;
          case "c" :
          if( e.ctrlKey) this.copyToClipBoard()
          break
  
        }console.log(e.key)
      })



    }


    setDisplayDateTime() { //método de hora e data

      this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
      this.displayDate = this.currentDate.toLocaleDateString(this._locale,
        {day: '2-digit',month: 'long',year: 'numeric'});//long para literal , digit para digito, numeric para numero

    }

    addEventListenerAll(element,events, fn){ //método criado para add varios eventos na mesma função sem precisar colocar varios codigos

      events.split(' ').forEach(event => {

        element.addEventListener(event,fn,false)

      })


    };

    clearAll(){// recebendo um array vazio limpa tudo

      this._operation = []
      this._lastNumber= ''
      this.lastOperation = ''
      this.setLastNumberToDisplay()

    };

    clearEntry(){ // comando pop() retira o ultimo item do array

      this._operation.pop()
      this.setLastNumberToDisplay()


    };

    setLastOperation(value){ //retira o ultimo item para concatenar

      this._operation[this._operation.length - 1] = value

    }



    isOperation(value){

     return (['+','-','/','%','*'].indexOf(value) > -1) // vai buscar dentro de value(valor digitado), se é algum desses operadores.
    

    }

    pushOperation(value){ // somar quando estiver com 3 itens

      this._operation.push(value)

      if(this._operation.length > 3){

        this.calc();

      }


    };


    getResult(){ // trata a tecla igual, repetindo a ultima operação
      try{
      return  eval( this._operation.join(""))// join retira as virgulas do array, virando string , EVAL faz o calculo
      }catch(e){
        setTimeout(()=>{

          this.setError()

        },10)


      }

    }

    calc(){ // metodo para realizar as operações..

      let last = ''

      this._lastOperator=this.getLastItem()  

      if(this._operation.length < 3){

        let firstItem = this._operation[0]
        this._operation = [firstItem, this._lastOperator , this._lastNumber ]

      }

      if(this._operation.length > 3){

      
      last = this._operation.pop();
      this._lastNumber = this.getResult() 

      }

      else if(this._operation.length == 3){

        this._lastNumber = this.getLastItem(false) 

      }
        let result = this.getResult()

        if(last == "%"){

      result /= 100;
      this._operation=[result];

    }else{

      this._operation=[result]


      if(last) this._operation.push(last)

    }

      this.setLastNumberToDisplay() // chamando para atualizar na tela

      console.log(this._operation) // detalha tudo que acontence dentro do array mo console.
    }




    setLastNumberToDisplay(){ // metodo para colocar as operações  no display da calculadora.

      let lastNumber = this.getLastItem(false) ;
 
      if(!lastNumber) lastNumber = 0;

      this.displayCalc = lastNumber;
      
    }




    getLastItem(isOperation = true){


      let lastItem ;

      for( let i = this._operation.length -1;i >= 0;i-- ){


      
          if(this.isOperation(this._operation[i])== isOperation){

            lastItem = this._operation[i]
  
            break;
          }
     
      }

      if(!lastItem){

        lastItem = (isOperation) ? this._lastOperator : this._lastNumber

      }


      return lastItem;

    }



    addOperation(value){ // add indice ao nosso array 

      if(isNaN(this.getLastOperation())){ // se for string

        if(this.isOperation(value)){ //trocar o operador por exemplo: '+' por '-'
      
        this.setLastOperation(value)
        
      }else{

        this.pushOperation(value)
        this.setLastNumberToDisplay()
        }


      }else{

        if(this.isOperation(value)){

        this.pushOperation(value)

        }else{
//se for um numero eu tranformo em string pra poder concatenar , depois passo para number de novo

          let newValue= this.getLastOperation().toString() + value.toString();
          this.setLastOperation(newValue); // add o a concateneção no array 
           this.setLastNumberToDisplay()
        }



      }




    }
    getLastOperation(){ //pega o ultimo item do array 

     return this._operation[this._operation.length - 1] 

    }



    setError(){ //retorna error , se houver falhas

      this.displayCalc = 'error';

    };


    addDot(){ //Tratamento para incluir o botão ponto nos calculos 

        let lastOperation = this.getLastOperation()

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > - 1 ) return;

      if(this.isOperation(lastOperation) || !lastOperation){

        this.pushOperation('0.')

      }else {

        this.setLastOperation(lastOperation.toString() + '.')

      } 


      this.setLastNumberToDisplay();

    }



    execBtn(value){ // cria repostas aos comandos que já sabemos as repostas com uso do switch.

      this.playAdio()

      switch (value){

        case 'ac' :
        
        this.clearAll();

        break;

        case 'ce' :

        this.clearEntry();

        break;

        case 'soma' :
          this.addOperation('+')
        break;

        case 'subtracao' :
          this.addOperation('-')
        break;

        case 'divisao' :
          this.addOperation('/')
        break;

        case 'multiplicacao' :
          this.addOperation('*')
        break;

        case 'porcento' :
          this.addOperation('%')
        break;

        case 'igual' :
        this.calc()
        break;

        case 'ponto' :
          this.addDot()
        break;

        case '0':
        case '1':
        case '2':  
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':  
        case '8':
        case '9': 
        this.addOperation(parseInt(value)) //add os numeros no array convertendo eles para numero, pois sairam como string.
           break;

       default :
       this.setError()
       break;

      }


    }





    initButtonsEvents(){

      let buttons = document.querySelectorAll('#buttons > g, #parts > g') //procure no id 'buttons' todos seus filhos que tenham o nome 'g'

        buttons.forEach((btn, index) => { // percorre todos os itens 

        this.addEventListenerAll(btn, "click drag", e =>{ //adiciona evento de click com um método adapdato para add varios eventos.

        let textBtn =btn.className.baseVal.replace('btn-','')//retorna apenas o nome da classe de um svg*** 
                                      // replace (retirar) serviu para tirar o 'btn-' do nome da classe.***

        this.execBtn(textBtn);                              


        });                               

  
    this.addEventListenerAll(btn,"mouseover mouseup mousedown", e =>{ //mudando o mouse para o cursor para pointer

      btn.style.cursor = "pointer";

    })

  });

}



    get displayTime(){//exibir na tela a hora

      return  this._timeEl.innerHTML;

    }

    set displayTime(value){ //exibir na tela a hora

      return  this._timeEl.innerHTML= value;

    }
    get displayDate(){ //exibir na tela a data

      return  this._dateEl.innerHTML;

    }

    set displayDate(value){//exibir na tela a data

      return  this._dateEl.innerHTML = value;

    }


    get displayCalc() { //exibir na tela os números das operações

    return this._displayCalcEl.innerHTML;

    }

    set displayCalc(value) { //exibir na tela os números das operações

      if(value.toString().length > 10){
        this.setError()
        return false;
      }

    this._displayCalcEl.innerHTML = value;

      }

    get currentDate(){ // método de pegar data 

    return new Date();

    }

    set currentDate (value) {

    this._currentDate = value;    

    }

}