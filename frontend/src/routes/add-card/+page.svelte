<script lang="ts">
  let question = '';
  let correctAnswers: string[] = [''];
  let wrongAnswers: string[] = [''];
  let isSubmitting = false;
  let message = '';

  function addCorrectAnswer() {
    correctAnswers = [...correctAnswers, ''];
  }

  function removeCorrectAnswer(index: number) {
    if (correctAnswers.length > 1) {
      correctAnswers = correctAnswers.filter((_, i) => i !== index);
    }
  }

  function addWrongAnswer() {
    wrongAnswers = [...wrongAnswers, ''];
  }

  function removeWrongAnswer(index: number) {
    if (wrongAnswers.length > 1) {
      wrongAnswers = wrongAnswers.filter((_, i) => i !== index);
    }
  }

  async function submitCard() {
    const filteredCorrect = correctAnswers.filter(answer => answer.trim());
    const filteredWrong = wrongAnswers.filter(answer => answer.trim());

    if (!question.trim()) {
      message = 'Please enter a question.';
      return;
    }
    if (filteredCorrect.length === 0) {
      message = 'Please provide at least one correct answer.';
      return;
    }
    if (filteredWrong.length === 0) {
      message = 'Please provide at least one wrong answer.';
      return;
    }

    isSubmitting = true;
    message = '';

    try {
      const response = await fetch('http://localhost:3001/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          correct_answers: filteredCorrect,
          wrong_answers: filteredWrong
        })
      });

      if (response.ok) {
        message = '✅ Card added successfully!';
        question = '';
        correctAnswers = [''];
        wrongAnswers = [''];
      } else {
        message = '❌ Error adding card. Please try again.';
      }
    } catch (error) {
      message = '❌ Error connecting to server.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-green-600 to-blue-700 py-8">
  <div class="container mx-auto px-4 max-w-2xl">
    <div class="bg-white rounded-lg shadow-xl p-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-800">➕ Add New Card</h1>
        <a href="/" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
          ← Home
        </a>
      </div>

      {#if message}
        <div class="mb-6 p-4 rounded-lg {message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
          {message}
        </div>
      {/if}

      <form on:submit|preventDefault={submitCard} class="space-y-6">
        <!-- Question -->
        <div>
          <label for="question" class="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <textarea
            id="question"
            bind:value={question}
            placeholder="Enter your question here..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            required
          ></textarea>
        </div>

        <!-- Correct Answers -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              Correct Answers
            </label>
            <button
              type="button"
              on:click={addCorrectAnswer}
              class="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              + Add
            </button>
          </div>
          {#each correctAnswers as answer, index}
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                bind:value={correctAnswers[index]}
                placeholder="Correct answer..."
                class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required={index === 0}
              />
              {#if correctAnswers.length > 1}
                <button
                  type="button"
                  on:click={() => removeCorrectAnswer(index)}
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  ✕
                </button>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Wrong Answers -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              Wrong Answers
            </label>
            <button
              type="button"
              on:click={addWrongAnswer}
              class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              + Add
            </button>
          </div>
          {#each wrongAnswers as answer, index}
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                bind:value={wrongAnswers[index]}
                placeholder="Wrong answer..."
                class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required={index === 0}
              />
              {#if wrongAnswers.length > 1}
                <button
                  type="button"
                  on:click={() => removeWrongAnswer(index)}
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  ✕
                </button>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={isSubmitting}
          class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Adding Card...' : 'Add Card'}
        </button>
      </form>
    </div>
  </div>
</div>