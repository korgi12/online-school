// Валидация формы обратной связи
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    
    if (!form) {
        console.error('Форма не найдена!');
        return;
    }
    
    console.log('Форма найдена, инициализируем валидацию...');

    // Элементы формы
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const courseSelect = document.getElementById('course');
    const messageInput = document.getElementById('message');

    // Проверяем что все элементы найдены
    if (!nameInput || !emailInput || !phoneInput || !courseSelect || !messageInput) {
        console.error('Не все элементы формы найдены!');
        return;
    }

    // Функции валидации для каждого поля
    function validateName(name) {
        if (!name.trim()) {
            return 'Поле обязательно для заполнения';
        }
        if (name.length < 2 || name.length > 50) {
            return 'Имя должно быть от 2 до 50 символов';
        }
        if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name)) {
            return 'Имя должно содержать только буквы и пробелы';
        }
        return '';
    }

    function validateEmail(email) {
        if (!email.trim()) {
            return 'Поле обязательно для заполнения';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'Введите корректный email адрес';
        }
        return '';
    }

    function validatePhone(phone) {
        if (!phone.trim()) {
            return ''; // Телефон не обязателен
        }
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length !== 11) {
            return 'Телефон должен содержать 11 цифр';
        }
        if (!/^(7|8)\d{10}$/.test(cleanPhone)) {
            return 'Неверный формат телефона';
        }
        return '';
    }

    function validateMessage(message) {
        if (!message.trim()) {
            return 'Поле обязательно для заполнения';
        }
        if (message.length < 10) {
            return 'Сообщение должно быть не менее 10 символов';
        }
        if (message.length > 1000) {
            return 'Сообщение должно быть не более 1000 символов';
        }
        return '';
    }

    // Функция отображения ошибки
    function showError(input, message) {
        const errorElement = document.getElementById(input.id + 'Error');
        console.log('Показываем ошибку для', input.id, ':', message);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }
        
        if (message) {
            input.classList.add('error');
            input.classList.remove('success');
        } else {
            input.classList.remove('error');
            input.classList.add('success');
        }
    }

    // Валидация отдельного поля
    function validateField(input) {
        let error = '';
        
        switch(input.id) {
            case 'name':
                error = validateName(input.value);
                break;
            case 'email':
                error = validateEmail(input.value);
                break;
            case 'phone':
                error = validatePhone(input.value);
                break;
            case 'message':
                error = validateMessage(input.value);
                break;
        }
        
        showError(input, error);
        return error === '';
    }

    // Валидация всей формы
    function validateAllFields() {
        console.log('--- ВАЛИДАЦИЯ ВСЕЙ ФОРМЫ ---');
        
        const isNameValid = validateField(nameInput);
        const isEmailValid = validateField(emailInput);
        const isPhoneValid = validateField(phoneInput);
        const isMessageValid = validateField(messageInput);

        console.log('Результаты валидации:', {
            name: isNameValid,
            email: isEmailValid,
            phone: isPhoneValid,
            message: isMessageValid
        });

        return isNameValid && isEmailValid && isPhoneValid && isMessageValid;
    }

    // Обработчики событий для полей
    nameInput.addEventListener('blur', function() {
        console.log('Валидация имени при blur:', this.value);
        validateField(this);
    });

    emailInput.addEventListener('blur', function() {
        console.log('Валидация email при blur:', this.value);
        validateField(this);
    });

    phoneInput.addEventListener('blur', function() {
        console.log('Валидация телефона при blur:', this.value);
        validateField(this);
    });

    messageInput.addEventListener('blur', function() {
        console.log('Валидация сообщения при blur:', this.value);
        validateField(this);
    });

    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        console.log('--- ОТПРАВКА ФОРМЫ ---');
        e.preventDefault(); // ВАЖНО: предотвращаем отправку
        
        const isFormValid = validateAllFields();
        console.log('Форма валидна?', isFormValid);

        if (!isFormValid) {
            console.log('Форма содержит ошибки, отправка отменена');
            
            // Находим первое поле с ошибкой
            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstErrorField.focus();
            }
            
            return; // Прерываем выполнение
        }

        console.log('Форма валидна, имитируем отправку...');
        
        // Показываем индикатор загрузки
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Отправка...';
        submitButton.disabled = true;

        // Имитация отправки
        setTimeout(() => {
            console.log('Отправка завершена');
            
            // Восстанавливаем кнопку
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Показываем сообщение об успехе
            showSuccessMessage();
            
            // Очищаем форму
            form.reset();
            
            // Сбрасываем стили
            const allInputs = form.querySelectorAll('input, textarea, select');
            allInputs.forEach(input => {
                input.classList.remove('error', 'success');
            });
            
            // Сбрасываем сообщения об ошибках
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(error => {
                error.textContent = '';
                error.style.display = 'none';
            });
            
        }, 2000);
    });

    // Функция показа успешного сообщения
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <strong>✓ Сообщение отправлено!</strong><br>
            Мы свяжемся с вами в ближайшее время.
        `;
        
        form.parentNode.insertBefore(successMessage, form.nextSibling);
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Дополнительные UX улучшения
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('7') || value.startsWith('8')) {
            if (value.length === 1) value = '+7 (';
            else if (value.length <= 4) value = '+7 (' + value.substring(1);
            else if (value.length <= 7) value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4);
            else if (value.length <= 9) value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7);
            else value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
        }
        
        e.target.value = value;
    });

    messageInput.addEventListener('input', function() {
        const hint = this.parentNode.querySelector('.hint');
        const count = this.value.length;
        if (hint) {
            const originalText = hint.textContent.split('(')[0].trim();
            hint.textContent = `${originalText} (${count}/1000)`;
            
            if (count < 10) {
                hint.style.color = '#e74c3c';
            } else if (count > 900) {
                hint.style.color = '#f39c12';
            } else {
                hint.style.color = '#7f8c8d';
            }
        }
    });

    console.log('Валидация инициализирована успешно!');
});

// Добавляем стили для анимации
document.head.insertAdjacentHTML('beforeend', `
<style>
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    .shake {
        animation: shake 0.5s;
    }
</style>
`);