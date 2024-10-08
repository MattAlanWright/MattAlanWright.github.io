// Elements
const flashCardQuestionText = document.getElementById("flash-card-question");
const flashCardAnswerText = document.getElementById("flash-card-answer");
const showBtn = document.getElementById("show-btn");
const nextBtn = document.getElementById("next-btn");

const keyCheckboxes = {
    Bb: document.getElementById("bb-checkbox"),
    F: document.getElementById("f-checkbox"),
    C: document.getElementById("c-checkbox"),
    G: document.getElementById("g-checkbox"),
}

const keyQuestionCheckboxes = {
    two: document.getElementById("two-checkbox"),
    fiveSeven: document.getElementById("five-seven-checkbox"),
    twoFiveOne: document.getElementById("two-five-one-checkbox"),
}

const chordQuestionCheckboxes = {
    chordThird: document.getElementById("chord-third-checkbox"),
    chordSeventh: document.getElementById("chord-seventh-checkbox"),
    chordNotes: document.getElementById("chord-notes-checkbox"),
    chordThirdAndSeventh: document.getElementById("chord-third-and-seventh-checkbox"),
    chordSeventhAndThird: document.getElementById("chord-seventh-and-third-checkbox"),
}

const state = {
    currentQuestionIndex: 0,
    questionsAndAnswers: []
}

function makeKey(key, chords) {
    return {
        key: key,
        chords: {
            ii: chords[0],
            V: chords[1],
            I: chords[2],
        },
    };
}

function makeChord(name, notes) {
    const chord = {
        name: name,
        i: notes[0],
        iii: notes[1],
        v: notes[2],
        vii: notes[3],
    };

    return chord;
}

const allChords = {
    // Bb
    Cm7: makeChord("Cm7", ["C", "Eb", "G", "Bb"]),
    F7: makeChord("F7", ["F", "A", "C", "Eb"]),
    Bbmaj7: makeChord("Bbmaj7", ["Bb", "D", "F", "A"]),

    // F
    Gm7: makeChord("Gm7", ["G", "Bb", "D", "F"]),
    C7: makeChord("C7", ["C", "E", "G", "Bb"]),
    Fmaj7: makeChord("Fmaj7", ["F", "A", "C", "E"]),

    // C
    Dm7: makeChord("Dm7", ["D", "F", "A", "C"]),
    G7: makeChord("G7", ["G", "B", "D", "F"]),
    Cmaj7: makeChord("Cmaj7", ["C", "E", "G", "B"]),

    // G
    Am7: makeChord("Am7", ["A", "C", "E", "G"]),
    D7: makeChord("D7", ["D", "F#", "A", "C"]),
    Gmaj7: makeChord("Gmaj7", ["G", "B", "D", "F#"]),
};

const allKeys = {
    Bb: makeKey("Bb", [allChords.Cm7, allChords.F7, allChords.Bbmaj7]),
    F: makeKey("F", [allChords.Gm7, allChords.C7, allChords.Fmaj7]),
    C: makeKey("C", [allChords.Dm7, allChords.G7, allChords.Cmaj7]),
    G: makeKey("G", [allChords.Am7, allChords.D7, allChords.Gmaj7]),
};

function makeV7QuestionAndAnswer(key) {
    return {
        question: `V7 of ${key.key}`,
        answer: key.chords.V.name,
    };
}

function makeTwoQuestionAndAnswer(key) {
    return {
        question: `ii of ${key.key}`,
        answer: key.chords.ii.name,
    };
}

function makeTwoFiveOneQuestionAndAnswer(key) {
    return {
        question: `ii V I in ${key.key}`,
        answer: `${key.chords.ii.name} - ${key.chords.V.name} - ${key.chords.I.name}`,
    };
}

function makeChordNotesQuestionAndAnswer(chord) {
    return {
        question: chord.name,
        answer: `${chord.i} ${chord.iii} ${chord.v} ${chord.vii}`,
    };
}

function makeThirdOfChordQuestionAndAnswer(chord) {
    return {
        question: `3rd of ${chord.name}`,
        answer: chord.iii,
    };
}

function makeSeventhOfChordQuestionAndAnswer(chord) {
    return {
        question: `7th of ${chord.name}`,
        answer: chord.vii,
    };
}

function makeThirdAndSeventhOfChordQuestionAndAnswer(chord) {
    return {
        question: `3 - 7 of ${chord.name}`,
        answer: `${chord.iii} - ${chord.vii}`,
    };
}

function makeSeventhAndThirdOfChordQuestionAndAnswer(chord) {
    return {
        question: `7 - 3 of ${chord.name}`,
        answer: `${chord.vii} - ${chord.iii}`,
    };
}

const keyQuestionGenerators = {
    two: makeTwoQuestionAndAnswer,
    fiveSeven: makeV7QuestionAndAnswer,
    twoFiveOne: makeTwoFiveOneQuestionAndAnswer,
}

const chordQuestionGenerators = {
    chordNotes: makeChordNotesQuestionAndAnswer,
    chordThird: makeThirdOfChordQuestionAndAnswer,
    chordSeventh: makeSeventhOfChordQuestionAndAnswer,
    chordThirdAndSeventh: makeThirdAndSeventhOfChordQuestionAndAnswer,
    chordSeventhAndThird: makeSeventhAndThirdOfChordQuestionAndAnswer,
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

for (const key in keyCheckboxes) {
    keyCheckboxes[key].addEventListener("change", () => {
        refresh();
    });
}

for (const questionType in keyQuestionCheckboxes) {
    keyQuestionCheckboxes[questionType].addEventListener("change", () => {
        refresh();
    });
}

for (const questionType in chordQuestionCheckboxes) {
    chordQuestionCheckboxes[questionType].addEventListener("change", () => {
        refresh();
    });
}

function getCheckedKeys() {
    const checkedKeys = [];
    for (const key in keyCheckboxes) {
        if (keyCheckboxes[key].checked) {
            checkedKeys.push(allKeys[key]);
        }
    }
    return checkedKeys;
}

function getCheckedKeyQuestions() {
    const checkedQuestionGenerators = [];
    for (const questionType in keyQuestionCheckboxes) {
        if (keyQuestionCheckboxes[questionType].checked) {
            checkedQuestionGenerators.push(keyQuestionGenerators[questionType]);
        }
    }
    return checkedQuestionGenerators;
}

function getCheckedChordQuestions() {
    const checkedChordQuestionGenerators = [];
    for (const questionType in chordQuestionCheckboxes) {
        if (chordQuestionCheckboxes[questionType].checked) {
            checkedChordQuestionGenerators.push(chordQuestionGenerators[questionType]);
        }
    }
    return checkedChordQuestionGenerators;
}

function buildQuestionsAndAnswers() {
    const qas = [];

    const activeKeys = getCheckedKeys();
    const activeKeyQuestionGenerators = getCheckedKeyQuestions();
    const activeChordQuestionGenerators = getCheckedChordQuestions();

    for (const key of activeKeys) {
        for (const questionGenerator of activeKeyQuestionGenerators) {
            qas.push(questionGenerator(key));
        }

        for (const questionGenerator of activeChordQuestionGenerators) {
            qas.push(questionGenerator(key.chords.ii));
            qas.push(questionGenerator(key.chords.V));
            qas.push(questionGenerator(key.chords.I));
        }
    }

    return qas;
}

function selectRandomQuestionAndAnswer() {
    let i = getRandomInt(state.questionsAndAnswers.length);
    state.currentQuestionIndex = i;
    return state.questionsAndAnswers[i];
}

function clearQuestionAndAnswer() {
    flashCardAnswerText.style.visibility = "visible";
    flashCardQuestionText.innerText = "--";
    flashCardAnswerText.innerText = "--";
}

function nextQuestionAndAnswer() {
    flashCardAnswerText.style.visibility = "hidden";
    qa = selectRandomQuestionAndAnswer();
    flashCardQuestionText.innerText = qa.question;
    flashCardAnswerText.innerText = qa.answer;
}

function refresh() {
    state.questionsAndAnswers = buildQuestionsAndAnswers();
    clearQuestionAndAnswer();
}

showBtn.addEventListener("click", () => {
    flashCardAnswerText.style.visibility = "visible";
});

nextBtn.addEventListener("click", () => {
    nextQuestionAndAnswer();
});

refresh()
