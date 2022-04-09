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
    currentQuestion = availableQuestions.pop() //removing used questions from array
    if(questionCounter === MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)
        return window.location.assign('/end.html')
    }

    //game page footer section
    progressText.innerText = `Question ${questionCounter+1} / ${MAX_QUESTIONS}`
    progressBarFull.style.width = `${((questionCounter+1)/MAX_QUESTIONS) * 100}%`
    question.innerText = currentQuestion.question

    //showing all 4 possible answers of the question 
    let j = 0
    for(let i = 0; i < currentQuestion.choices.length; i++){
        j++
        document.getElementsByClassName("choice-container")[i].style.display = "flex"
        choices[i].innerText = currentQuestion.choices[i].answer
    }
    //showing 2 possible answers of a bool question
    while(j < 4){
        document.getElementsByClassName("choice-container")[j].style.display = "none"
        j++
    }
    acceptingAnswers = true
    questionCounter++
}

//gifs' arrays
let compliments = ['gifs/amazing.gif','gifs/wow.gif','gifs/confetti.gif', 'gifs/great_job.gif', 'gifs/bravo.gif', 'gifs/clap.gif']
let wrongImages = ['gifs/booho.gif', 'gifs/x.gif', 'gifs/wrong.gif', 'gifs/wrong2.gif', 'gifs/false.gif', 'gifs/no.gif']

choices.forEach(choice => {
    //on click listener 
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return
        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']

        //if the selected answer is correct then make the answer green, else make it red
        const classToApply = currentQuestion.choices[selectedAnswer].is_correct ? 'correct' : 'incorrect'
         
        //removes the question's difficulty indicator at the end of the questionaire 
         if(questionCounter===MAX_QUESTIONS){
            document.getElementById("difficulty-indicator").style.display = "none"
        }

        //Scoring the correct answers according to the question's difficulty
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

            //show a suitable gif according to correct/incorrect answer
            const randomCompliments = Math.floor(Math.random() * compliments.length);
            document.getElementById("compliment").src = compliments[randomCompliments]
            document.getElementById("compliment").style.display = "flex" 
        } else if(classToApply === 'incorrect'){
            const randomWrongs = Math.floor(Math.random() * wrongImages.length);
            document.getElementById("compliment").src = wrongImages[randomWrongs]
            document.getElementById("compliment").style.display = "flex" 
        }

        
        selectedChoice.parentElement.classList.add(classToApply)
        
        //produce a new question when the timer is at 0 seconds
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
            difficultyIndicator.innerHTML=difficultyQuestion[questionCounter-1]
            document.getElementById("compliment").style.display = "none"
        },1300)
        timeCount = 16
    })
})

//sum the final score 
incrementScore = num => {
    score+=num
    scoreText.innerText = score
}

//setting a timer to 15 seconds per question
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
 

 //fetching the question from the given API
fetchQuestions = (count = 2)=>{
    document.getElementById("loading").style.display = "block"
    let request = new XMLHttpRequest()
    request.open("GET", `https://opentdb.com/api.php?amount=${count}`)
    request.send()
    request.onload = () => {
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

//random function
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

//fixing gibberish characters
decodeHTMLEntities =(text) =>{
    var textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }
