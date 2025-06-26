<script lang="ts">
  import { onMount } from 'svelte';

  interface Question {
    id: number;
    questionNumber: number;
    question: string;
    answers: string[];
    correctAnswers: string[];
  }

  let questions: Question[] = [];
  let currentQuestionIndex = 0;
  let selectedAnswers: string[] = [];
  let score = 0;
  let isLoading = true;
  let error = '';
  let quizCompleted = false;

  $: currentQuestion = questions[currentQuestionIndex];
  $: progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  onMount(async () => {
    await loadQuiz();
  });

  async function loadQuiz() {
    try {
      const response = await fetch('http://localhost:3001/api/flashcards/quiz');
      if (response.ok) {
        const data = await response.json();
        questions = data.questions;
        isLoading = false;
      } else {
        error = 'Failed to load quiz. Make sure you have at least 10 flashcards.';
        isLoading = false;
      }
    } catch (err) {
      error = 'Error connecting to server.';
      isLoading = false;
    }
  }

  function toggleAnswer(answer: string) {
    if (selectedAnswers.includes(answer)) {
      selectedAnswers = selectedAnswers.filter(a => a !== answer);
    } else {
      selectedAnswers = [...selectedAnswers, answer];
    }
  }

  function nextQuestion() {
    // Check if answer is correct
    const correct = currentQuestion.correctAnswers;
    const isCorrect = correct.length === selectedAnswers.length && 
                     correct.every(ans => selectedAnswers.includes(ans)) &&
                     selectedAnswers.every(ans => correct.includes(ans));
    
    if (isCorrect) {
      score++;
    }

    // Move to next question or finish quiz
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      selectedAnswers = [];
    } else {
      quizCompleted = true;
    }
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    selectedAnswers = [];
    score = 0;
    quizCompleted = false;
    loadQuiz();
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 py-8">
  <div class="container mx-auto px-4 max-w-2xl">
    <div class="bg-white rounded-lg shadow-xl p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-800">🎯 Quiz Time</h1>
        <a href="/" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
          ← Home
        </a>
      </div>

      {#if isLoading}
        <div class="text-center py-12">
          <div class="text-lg text-gray-600">Loading quiz...</div>
        </div>
      {:else if error}
        <div class="text-center py-12">
          <div class="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            {error}
          </div>
          <a href="/add-card" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors">
            Add More Cards
          </a>
        </div>
      {:else if quizCompleted}
        <!-- Results Screen -->
        <div class="text-center py-12">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">🎉 Quiz Complete!</h2>
          <div class="text-6xl font-bold text-blue-600 mb-4">{score}/{questions.length}</div>
          <div class="text-xl text-gray-600 mb-8">
            You scored {Math.round((score / questions.length) * 100)}%
          </div>
          <div class="space-y-4">
            <button
              on:click={restartQuiz}
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors mr-4"
            >
              🔄 Play Again
            </button>
            <a href="/" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors">
              🏠 Home
            </a>
          </div>
        </div>
      {:else if currentQuestion}
        <!-- Quiz Question -->
        <div>
          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>Score: {score}/{currentQuestionIndex}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style="width: {progress}%"
              ></div>
            </div>
          </div>

          <!-- Question -->
          <div class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>
            
            <!-- Answer Options -->
            <div class="space-y-3">
              {#each currentQuestion.answers as answer}
                <button
                  on:click={() => toggleAnswer(answer)}
                  class="w-full p-4 text-left border-2 rounded-lg transition-all
                         {selectedAnswers.includes(answer) 
                           ? 'border-blue-500 bg-blue-50 text-blue-800' 
                           : 'border-gray-300 hover:border-gray-400 bg-white'}"
                >
                  <div class="flex items-center">
                    <div class="w-5 h-5 mr-3 border-2 rounded 
                                {selectedAnswers.includes(answer) 
                                  ? 'border-blue-500 bg-blue-500' 
                                  : 'border-gray-300'}">
                      {#if selectedAnswers.includes(answer)}
                        <div class="text-white text-xs text-center">✓</div>
                      {/if}
                    </div>
                    {answer}
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <!-- Next Button -->
          <button
            on:click={nextQuestion}
            disabled={selectedAnswers.length === 0}
            class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>