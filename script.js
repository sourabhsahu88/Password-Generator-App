const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const indicator = document.querySelector("[data-indicator]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const SymbolsCheck = document.querySelector("#symbols");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const generateBtn = document.querySelector(".generateButton");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
   inputSlider.value=passwordLength;
   lengthDisplay.innerText=passwordLength;

   const min=inputSlider.min;
   const max=inputSlider.max; 

    inputSlider.style.backgroundSize=(passwordLength-min)*100/(max - min)+"% 100%";
}

function setIndicator(color){
   indicator.style.backgroundColor=color;
   indicator.style.boxShadow=`0px 0px 12px 1px ${color}`
}

function getRandomInteger(min,max){
  return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandomInteger(1,9);
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateSymbol(){
    const radNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(radNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(SymbolsCheck.checked) hasSymbol=true;
    if(numberCheck.checked) hasNumber=true;

    if( hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength>=8)
     setIndicator("#0f0");
     else if( (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
      )
      setIndicator("#ff0");
      else
      setIndicator("#f00");
}

async function copyContent(){
      try{
           await navigator.clipboard.writeText(passwordDisplay.value);
           copyMsg.innerText = "copied";
      }
      catch(e){
        copyMsg.innerText = "Failed";
      }

      copyMsg.classList.add('active');

      setTimeout(()=>{
        copyMsg.classList.remove('active');
      },2000);

}

inputSlider.addEventListener('input',(e)=>{
  passwordLength=e.target.value;
  handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
    else return;
});

function shufflePassword(array){
   //fisher yates mathod
   for(let i=array.length-1;i>0;i--)
   {
      const j=Math.floor(Math.random()*(i+1));
      const temp = array[i]
      array[i]=array[j];
      array[j]=temp;
   }

   let str="";
   array.forEach((el)=>{str+=el});
   return str;
}

function handelCheckBoxChange(){
  checkCount=0;
  allCheckBox.forEach((checkbox)=>{
       if(checkbox.checked)
        checkCount++;
  });

  if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handelCheckBoxChange);
});


generateBtn.addEventListener('click',()=>{

  //none of the character selected
  if(passwordLength<=0) return;

  if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
  }
 
  password="";

  // if(uppercaseCheck.checked){
  //   password=generateUpperCase();
  // }

  // if(lowercaseCheck.checked){
  //   password=generateLowerCase();
  // }

  // if(numberCheck.checked){
  //   password=generateRandomNumber();
  // }

  // if(SymbolsCheck.checked){
  //   password=generateSymbol();
  // }

   let funcArr=[];

    if(uppercaseCheck.checked)
     funcArr.push(generateUpperCase);
    
    if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

    if(numberCheck.checked)
    funcArr.push(generateRandomNumber);

    if(SymbolsCheck.checked)
    funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
       password+=funcArr[i]();
    }

    //secodary addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRandomInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));
      
    //display password
    passwordDisplay.value=password;

    //calculate strength
    calcStrength();

});