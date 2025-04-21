const colorValues = {
    "Черный": { value: 0, multiplier: 1 },
    "Коричневый": { value: 1, multiplier: 10 },
    "Красный": { value: 2, multiplier: 100 },
    "Оранжевый": { value: 3, multiplier: 1000 },
    "Желтый": { value: 4, multiplier: 10000 },
    "Зеленый": { value: 5, multiplier: 100000 },
    "Синий": { value: 6, multiplier: 1000000 },
    "Фиолетовый": { value: 7, multiplier: 10000000 },
    "Серый": { value: 8, multiplier: 100000000 },
    "Белый": { value: 9, multiplier: 1000000000 },
    "Золотой": { value: -1, multiplier: 0.1 },
    "Серебряный": { value: -2, multiplier: 0.01 }
};

const toleranceValues = {
    "Коричневый": "±1%",
    "Красный": "±2%",
    "Зеленый": "±0.5%",
    "Синий": "±0.25%",
    "Фиолетовый": "±0.1%",
    "Серый": "±0.05%",
    "Золотой": "±5%",
    "Серебряный": "±10%",
    "Отсутствует": "±20%"
};

const tempCoeffValues = {
    "Коричневый": "100 ppm/°C",
    "Красный": "50 ppm/°C",
    "Оранжевый": "15 ppm/°C",
    "Желтый": "25 ppm/°C",
    "Синий": "10 ppm/°C",
    "Фиолетовый": "5 ppm/°C",
    "Белый": "1 ppm/°C"
};

function populateSelects() {
    const bandsContainer = document.getElementById('bandsContainer');
    bandsContainer.innerHTML = '';
    const numBands = parseInt(document.getElementById('numBands').value);

    // Создаем нужное количество полос в зависимости от выбора
    if (numBands === 4) {
        createBandSelect("Первая цифра:", false, false);
        createBandSelect("Вторая цифра:", false, false);
        createBandSelect("Множитель:", false, true);
        createBandSelect("Допуск:", true, false);
    } 
    else if (numBands === 5) {
        createBandSelect("Первая цифра:", false, false);
        createBandSelect("Вторая цифра:", false, false);
        createBandSelect("Третья цифра:", false, false);
        createBandSelect("Множитель:", false, true);
        createBandSelect("Допуск:", true, false);
    }
    else if (numBands === 6) {
        createBandSelect("Первая цифра:", false, false);
        createBandSelect("Вторая цифра:", false, false);
        createBandSelect("Третья цифра:", false, false);
        createBandSelect("Множитель:", false, true);
        createBandSelect("Допуск:", true, false);
        createBandSelect("Темп.коэфф.:", false, false, true);
    }
}

function createBandSelect(labelText, isTolerance, isMultiplier, isTempCoeff = false) {
    const container = document.getElementById('bandsContainer');
    const div = document.createElement('div');
    div.className = 'form-group';
    
    const label = document.createElement('label');
    label.textContent = labelText;
    
    const select = document.createElement('select');
    
    if (isTolerance) {
        // Заполняем варианты допусков
        for (let color in toleranceValues) {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            select.appendChild(option);
        }
    } 
    else if (isMultiplier) {
        // Заполняем варианты множителей (исключаем цвета, не используемые как множители)
        const multiplierColors = ["Черный", "Коричневый", "Красный", "Оранжевый", 
                                "Желтый", "Зеленый", "Синий", "Фиолетовый", 
                                "Серый", "Белый", "Золотой", "Серебряный"];
        for (let color of multiplierColors) {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            select.appendChild(option);
        }
    }
    else if (isTempCoeff) {
        // Заполняем варианты температурных коэффициентов
        for (let color in tempCoeffValues) {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            select.appendChild(option);
        }
    }
    else {
        // Заполняем обычные цифровые полосы (исключаем золотой и серебряный)
        const digitColors = ["Черный", "Коричневый", "Красный", "Оранжевый", 
                           "Желтый", "Зеленый", "Синий", "Фиолетовый", 
                           "Серый", "Белый"];
        for (let color of digitColors) {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            select.appendChild(option);
        }
    }
    
    div.appendChild(label);
    div.appendChild(select);
    container.appendChild(div);
}

function calculateResistance() {
    const numBands = parseInt(document.getElementById('numBands').value);
    const selects = document.querySelectorAll('#bandsContainer select');
    let resistance = 0;
    let tolerance = "";
    let tempCoeff = "";

    try {
        if (numBands === 4) {
            const digit1 = colorValues[selects[0].value].value;
            const digit2 = colorValues[selects[1].value].value;
            const multiplier = colorValues[selects[2].value].multiplier;
            tolerance = toleranceValues[selects[3].value];
            resistance = (digit1 * 10 + digit2) * multiplier;
        } 
        else if (numBands === 5) {
            const digit1 = colorValues[selects[0].value].value;
            const digit2 = colorValues[selects[1].value].value;
            const digit3 = colorValues[selects[2].value].value;
            const multiplier = colorValues[selects[3].value].multiplier;
            tolerance = toleranceValues[selects[4].value];
            resistance = (digit1 * 100 + digit2 * 10 + digit3) * multiplier;
        }
        else if (numBands === 6) {
            const digit1 = colorValues[selects[0].value].value;
            const digit2 = colorValues[selects[1].value].value;
            const digit3 = colorValues[selects[2].value].value;
            const multiplier = colorValues[selects[3].value].multiplier;
            tolerance = toleranceValues[selects[4].value];
            tempCoeff = tempCoeffValues[selects[5].value] || selects[5].value;
            resistance = (digit1 * 100 + digit2 * 10 + digit3) * multiplier;
        }

        let resultText = `Сопротивление: ${formatResistance(resistance)}`;
        if (tolerance) resultText += `, Допуск: ${tolerance}`;
        if (tempCoeff) resultText += `, Темп.коэфф.: ${tempCoeff}`;
        
        document.getElementById('result').textContent = resultText;
    } catch (e) {
        document.getElementById('result').textContent = "Ошибка расчета. Проверьте выбранные цвета.";
        console.error(e);
    }
}

function formatResistance(resistance) {
    if (isNaN(resistance)) return "не определено";
    
    if (resistance >= 1000000) {
        return (resistance / 1000000).toFixed(2) + " МОм";
    } else if (resistance >= 1000) {
        return (resistance / 1000).toFixed(2) + " кОм";
    } else if (resistance >= 1) {
        return resistance.toFixed(2) + " Ом";
    } else if (resistance >= 0.001) {
        return (resistance * 1000).toFixed(2) + " мОм";
    } else {
        return resistance.toString();
    }
}

function updateBands() {
    populateSelects();
    calculateResistance(); // Пересчитываем при изменении количества полос
}

// Инициализация при загрузке страницы
window.onload = function() {
    populateSelects();
    // Автоматический пересчет при изменении любых значений
    document.getElementById('bandsContainer').addEventListener('change', calculateResistance);
    document.getElementById('numBands').addEventListener('change', updateBands);
};