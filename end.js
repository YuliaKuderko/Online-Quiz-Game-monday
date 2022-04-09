const username = document.querySelector('#username')
const saveScoreBtn = document.querySelector('#saveScoreBtn')
const finalScore = document.querySelector('#finalscore')
const mostRecentScore = localStorage.getItem('mostRecentScore')


const highScores = JSON.parse(localStorage.getItem('highScores')) || []

const MAX_HIGH_SCORES = 10

finalScore.innerText = mostRecentScore

username.addEventListener('keyup', () => {
    saveScoreBtn.setAttribute('disabled','disabled')
    if (username.value != "") {
        saveScoreBtn.removeAttribute('disabled')
    }
    
})


saveHighScore = e => {
    e.preventDefault() 

    const score = {
        score: mostRecentScore,
        name: username.value
    }

    highScores.push(score)

    highScores.sort((a, b) => {
        return b.score - a.score 
    })

    highScores.splice(10)

    localStorage.setItem('highScores', JSON.stringify(highScores))
    window.location.assign('/highScores.html')
}