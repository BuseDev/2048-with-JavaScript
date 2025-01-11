document.addEventListener('DOMContentLoaded', () =>
{
    const gridDisplay = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const resultDisplay = document.getElementById('result')
    const width = 4
    let squares = []
    let score = 0

    //create the playing board
    function createBoard(){
        for (let i = 0; i < width * width; i++){
           const square = document.createElement('div')
           square.innerHTML = 0
           gridDisplay.appendChild(square)
           squares.push(square)
        }
        generate()
        generate()
    }
    createBoard()

    //generate a new number
    function generate(){
        const randomNumber = Math.floor(Math.random() * squares.length) // 0 ve 16 arasında bir sayı üretir (16 dahil değil)
        //Math.floor(), bir sayıyı her zaman aşağıya yuvarlayarak en yakın tam sayıyı döndürür. 
        if(squares[randomNumber].innerHTML == 0){
            squares[randomNumber].innerHTML = 2
            checkForGameOver()
        }else generate()
    }

    function moveRight() {
        for(let i = 0; i < 16; i++) {
            if(i % 4 == 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i+1].innerHTML
                let totalThree = squares[i+2].innerHTML
                let totalFour = squares[i+3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
                
                //filter metodu bir diziyi filtrelemek için kullanılır. Burada filtrelenen dizi row'dur
                let filteredRow = row.filter(num => num)//0 olmayanlar filtrelenir
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0) //Uzunluğu missing olan boş bir dizi oluşturur ve tüm öğelere 0 değerini atar
                let newRow = zeros.concat(filteredRow)
                //sıfırlı diziye filtrelenmiş dizi concat fonksiyonu ile eklenir
                //concat fonksiyonu sağdan değer eklediği için filtrelenmiş tüm değerler sağda olur(yani sağa kaydırılmış olur)
 
                squares[i].innerHTML = newRow[0]
                squares[i+1].innerHTML = newRow[1]
                squares[i+2].innerHTML = newRow[2]
                squares[i+3].innerHTML = newRow[3]
            }
        }
    }


    function moveLeft(){
        for(let i = 0; i < 16; i++) {
            if(i % 4 == 0) {
                let totalOne = squares[i].innerHTML
                let totalTwo = squares[i+1].innerHTML
                let totalThree = squares[i+2].innerHTML
                let totalFour = squares[i+3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
                
                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = filteredRow.concat(zeros)
                //filtrelenmiş diziye sıfırlı dizi concat fonksiyonu ile eklenir
                //bu sayede h-fitrelenmiş değerler solda olur
 
                squares[i].innerHTML = newRow[0]
                squares[i+1].innerHTML = newRow[1]
                squares[i+2].innerHTML = newRow[2]
                squares[i+3].innerHTML = newRow[3]
            }
        }
    }

    
    function moveUp(){
        for(let i = 0; i < 4; i++){
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i+width].innerHTML
            let totalThree = squares[i+width*2].innerHTML
            let totalFour = squares[i+width*3].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
            
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = filteredColumn.concat(zeros)

            squares[i].innerHTML = newColumn[0]
            squares[i+width].innerHTML = newColumn[1]
            squares[i+width*2].innerHTML = newColumn[2]
            squares[i+width*3].innerHTML = newColumn[3]
        }
    }


    function moveDown(){
        for(let i = 0; i < 4; i++){
            let totalOne = squares[i].innerHTML
            let totalTwo = squares[i+width].innerHTML
            let totalThree = squares[i+width*2].innerHTML
            let totalFour = squares[i+width*3].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]
            
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = zeros.concat(filteredColumn)

            squares[i].innerHTML = newColumn[0]
            squares[i+width].innerHTML = newColumn[1]
            squares[i+width*2].innerHTML = newColumn[2]
            squares[i+width*3].innerHTML = newColumn[3]
        }
    }

    
    function combineRow() {
        for(let i = 0; i < 15; i++) {
            if(squares[i].innerHTML === squares[i+1].innerHTML){
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i+1].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i+1].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    function combineColumn() {
        for(let i = 0; i < 12; i++) {
            if(squares[i].innerHTML === squares[i+width].innerHTML){
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i+width].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i+width].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    //assign functions to keys
    function control(e){
        if(e.key === 'ArrowLeft') {
            keyLeft()
        }else if(e.key === 'ArrowRight'){
            keyRight()
        }else if(e.key === 'ArrowUp'){
            keyUp()
        }else if(e.key === 'ArrowDown'){
            keyDown()
        }
    }
    document.addEventListener('keydown', control)

    function keyLeft() {
        moveLeft()
        combineRow()
        moveLeft()
        generate()
    }

    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
    }

    function keyUp(){
        moveUp()
        combineColumn()
        moveUp()
        generate()
    }

    function keyDown(){
        moveDown()
        combineColumn()
        moveDown()
        generate()
    }


    //check for the number 2048 in the squares to win
    function checkForWin(){
        for(let i = 0; i<squares.length; i++){
            if(squares[i].innerHTML == 2048){
                resultDisplay.innerHTML = 'You Win!'
                document.removeEventListener('keydown', control)
                //şu event listeneri kaldırmak için kullanıldı ----> addEventListener('keydown', control)
                setTimeout(clear, 3000)
            }
        }
    }

    //check if there are no zeros on the board to lose
    function checkForGameOver(){
        let zero = 0
        for(let i = 0; i < squares.length; i++){
            if(squares[i].innerHTML == 0){
                zero++
            }
        }
        if(zero == 0){
            resultDisplay.innerHTML = 'You Lose!'
            document.removeEventListener('keydown', control)
            setTimeout(clear, 3000)
        }
    }

    function clear(){
        clearInterval(myTimer)
    }

    //add colours
    function addColours(){
        for(let i = 0; i < squares.length; i++){
            if(squares[i].innerHTML == 0) squares[i].style.backgroundColor = '#afa192'
            else if(squares[i].innerHTML == 2) squares[i].style.backgroundColor = '#eee4da'
            else if(squares[i].innerHTML == 4) squares[i].style.backgroundColor = '#ede0c8'
            else if(squares[i].innerHTML == 8) squares[i].style.backgroundColor = '#f2b179'
            else if(squares[i].innerHTML == 16) squares[i].style.backgroundColor = '#ffcea4'
            else if(squares[i].innerHTML == 32) squares[i].style.backgroundColor = '#e8c064'
            else if(squares[i].innerHTML == 64) squares[i].style.backgroundColor = '#ffab6e'
            else if(squares[i].innerHTML == 128) squares[i].style.backgroundColor = '#fd9982'
            else if(squares[i].innerHTML == 256) squares[i].style.backgroundColor = '#ead79c'
            else if(squares[i].innerHTML == 512) squares[i].style.backgroundColor = '#76daff'
            else if(squares[i].innerHTML == 1024) squares[i].style.backgroundColor = '#beeaa5'
            else if(squares[i].innerHTML == 2048) squares[i].style.backgroundColor = '#d7d4f0'
        }
    }
    addColours()


    let myTimer = setInterval(addColours, 20)
    


})




//Notlarım:

//() => {...} bu bir ok fonksiyonudur (arrow function)

//DOM (Document Object Model)
//Document: Belgeyi ifade eder, yani tarayıcıya yüklenen HTML veya XML belgesini.
//Object: Web sayfasındaki her bir öğeyi (etiket, metin, özellik vb.) bir JavaScript nesnesi olarak temsil eder.
//Model: Belgenin ağaç yapısını (tree structure) ifade eder.

//Bir HTML belgesi yüklendiğinde, tarayıcı bu belgeyi analiz eder (parse eder) ve bir DOM ağacı oluşturur. Bu DOM ağacı, belgeyi hiyerarşik bir yapıda temsil eder.

//DOMContentLoaded, genellikle sayfa yükleme sürecini optimize etmek ve daha hızlı kullanıcı deneyimi sağlamak için kullanılır.

//document.querySelector('...') ----> daha geniş kapsamlı seçici

//console.log(gridDisplay) -------> <div class="grid"></div>

//.appendChild(...) metodu bir DOM öğesine child (alt öğe) eklemek için kullanılır.

//Math.random() metodu aralık belirtilmediğinde 0 ve 1 arasında bir float sayı üretir.

//num => num: Bu, bir ok fonksiyonu (arrow function)'dur. Burada num bir değeri ifade eder ve bu değer "truthy" (doğru) ise, yani null, undefined, 0, false veya boş string ("") değilse, bu değer filteredRow dizisine eklenir.
//Örneğin:
//const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//const evenNumbers = numbers.filter(num => num % 2 === 0); burada ikiye tam bölünen sayıları filtrelemek için kullanılır

//let newRow = zeros.concat(filteredRow)
//concat fonksiyonu bir diziye başka bir diziyi eklemek (birleştirmek) için kullanılır
//eklenecek dizi sağ taraftan diğer diziye dahil edilir




