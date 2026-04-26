const numberInput = document.getElementById('numberInput');
const checkButton = document.getElementById('checkButton');
const result = document.getElementById('result');

checkButton.addEventListener('click', () => {
    const number = parseInt(numberInput.value);
    if (isNaN(number)) {
        result.textContent = 'Please enter a valid number.';
        return;
    }

    if (isPrime(number)) {
        result.textContent = `${number} is a prime number.`;
    } else {
        result.textContent = `${number} is not a prime number.`;
    }
});

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;

    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i = i + 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }

    return true;
}