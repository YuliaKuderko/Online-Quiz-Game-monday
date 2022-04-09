const question = document.querySelector('#question')
const choices =  Array.from(document.querySelectorAll('.choice-text'))
const progressText = document.querySelector('#progressText')
const scoreText = document.querySelector('#score')
const difficultyIndicator = document.querySelector('#difficulty-indicator')

let currentQuestion = {}
let acceptingAnswers = false
let score = 0
let questionCounter = 0
let availableQuestions = []
let difficultyQuestion = []


const SCORE_10_POINTS = 10
const SCORE_20_POINTS = 20
const SCORE_50_POINTS = 50
const MAX_QUESTIONS = 10
let timeCount = 15

startGame = () => {
    questionCounter = 0
    score = 0
    getNewQuestion()
    setTimer()
}

getNewQuestion = () => {
    currentQuestion = availableQuestions.pop()
    if(questionCounter === MAX_QUESTIONS) {
        console.log(questionCounter)
        localStorage.setItem('mostRecentScore', score)
        return window.location.assign('/end.html')
    }
    progressText.innerText = `Question ${questionCounter+1} of ${MAX_QUESTIONS}`
    progressBarFull.style.width = `${(questionCounter+1/MAX_QUESTIONS) * 100}%`
    question.innerText = currentQuestion.question

    let j = 0

    for(let i = 0; i < currentQuestion.choices.length; i++){
        j++
        document.getElementsByClassName("choice-container")[i].style.display = "flex"
        console.log(currentQuestion.choices[i])
        choices[i].innerText = currentQuestion.choices[i].answer
    }
    while(j < 4){
        console.log(j)
        document.getElementsByClassName("choice-container")[j].style.display = "none"
        j++
    }
    acceptingAnswers = true
    questionCounter++
}

let images = ['amazing.gif','wow.gif','confetti.gif', 'great_job.gif', 'bravo.gif', 'clap.gif']

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return
        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']

        const classToApply = currentQuestion.choices[selectedAnswer].is_correct ? 'correct' : 'incorrect'
        difficultyIndicator.innerHTML=difficultyQuestion[questionCounter-1]

        if(classToApply === 'correct'){
            switch(difficultyQuestion[questionCounter-1]){
                case 'easy':
                    incrementScore(SCORE_10_POINTS)
                    break
                case 'medium':
                    incrementScore(SCORE_20_POINTS)
                    break
                case 'hard':
                    incrementScore(SCORE_50_POINTS)
                    break
            }
            const randomImages = Math.floor(Math.random() * images.length);
            document.getElementById("compliment").src = images[randomImages]
            document.getElementById("compliment").style.display = "flex" 
        }
        
        selectedChoice.parentElement.classList.add(classToApply)
        
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
            document.getElementById("compliment").style.display = "none"
        },1500)
        timeCount = 16
    })
})

incrementScore = num => {
    score+=num
    scoreText.innerText = score
}


 setTimer = () =>{
     var interval = setInterval(function(){
         timeCount--
         document.getElementById('time-sec').innerText=timeCount
         if(timeCount===0){
            getNewQuestion()
            timeCount = 16
         }
    },1000)
 }
 

fetchQuestions = (count = 2)=>{
    document.getElementById("loading").style.display = "block"
    let request = new XMLHttpRequest()
    request.open("GET", `https://opentdb.com/api.php?amount=${count}`)
    request.send()
    request.onload = () => {
        console.log(request)
        if(request.status !== 200) {
            console.log(`error ${request.status} ${request.statusText}`) 
            return 
        }
        const fetchedQuestions = JSON.parse(request.response).results
        fetchedQuestions.forEach(q => {
            let questionToinsert ={
                question: decodeHTMLEntities(q.question),
                choices: []
            }
            difficultyQuestion.push(q.difficulty)
            questionToinsert.choices.push({answer: decodeHTMLEntities(q.correct_answer), is_correct: true})
            q.incorrect_answers.forEach(a => {
                questionToinsert.choices.push({answer: decodeHTMLEntities(a), is_correct: false})
            })
            questionToinsert.choices = randomize(questionToinsert.choices)
            availableQuestions.push(questionToinsert)
        })
        startGame()
        document.getElementById("loading").style.display = "none"
        document.getElementById("question").style.display = "block"                              
    }
}
fetchQuestions(MAX_QUESTIONS)


randomize = (arr) => {
    for (var i = 0; i < arr.length; i++){
        const original = arr[i]
        const j = Math.floor(Math.random() * arr.length)
        let tmp = arr[j]
        arr[j]= original
        arr[i] = tmp
    }
    return arr
}

decodeHTMLEntities =(text) =>{
    var textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }
