let calc = document.querySelector('.calc')

let current_text = []

let inputs = calc.querySelector('.inputs')
let text_contain = calc.querySelector('.text')
let text = text_contain.querySelector('.ans')
let preview_text = text_contain.querySelector('.current')

function isOperator() {
	let operators = ['/', '*', '-', '+']

	let latest = current_text[current_text.length-1]
	if (operators.includes(latest)) {
		return true
	}
}

function isNumber() {
	let latest = current_text[current_text.length-1]
	if ((typeof latest == 'object') && latest.type == 'NumberText') {
		return latest
	}
}

function currentText() {
	let t = ''
	for (let item of current_text) {
		let m = item;
		if ((typeof item == 'object') && item.type == 'NumberText') {
			m = item.number()
		}
		t += m
	} return t
}

function currentTextCalc() {
	let t = ''
	for (let item of current_text) {
		let m = item;
		if ((typeof item == 'object') && item.type == 'NumberText') {
			m = item.data
		}
		t += m
	} 
	return t
}

function clearCurrent(keeplist=false) {
	calc.querySelector('.text .current').innerHTML = ''
	calc.querySelector('.text .ans').innerHTML = '0'
	text.style['fontSize'] = '75px'

	if (keeplist) {
		return true
	}
	current_text = []
}

let NumberText = function(num) {
	this.data = String(num)

	this.toNegative = function() {
		let num = this.data
		if (num >= 1) {
			this.data = num * (-1)
		} else {
			this.data = num - (num * 2)
		}
	}

	this.number = function() {
		let data = this.data

		let new_num = '';

		if (String(data)[0] == '-') {
			data = String(data).slice(1)
			new_num += '-'
		}

		if (data < 1000) {
			new_num += String(data)
		} else {
			new_num += String(Number(data).toLocaleString('en-US'))
		}
		return new_num
	}

	this.type = 'NumberText'

	this.hasPeriod = function() {
		if (this.data.includes('.')) {
			return true
		}
	}

	this.toPercent = function() {
		return this.data *= 0.01
	}

	this.append = function(new_num) {
		let recentNum = isNumber()
		if (new_num == '.') {
			if (!this.hasPeriod()) {
				this.data += '.'
			}
			return true
		}

		if (this.data.length >= 9) {
			return true
		}

		if (this.data == '0') {
			this.data = String(new_num)
			return true
		}

		for (let num = 0; num <= 10; num++) {
			if (Number(new_num) === num) {
				this.data = `${this.data}${new_num}`
			}
		}
	}
}

for (let input of inputs.children) {
	input.onclick = function() {
		let currentNum = isNumber()
		function resizeText(append=false) {
			let calc_contain = calc.querySelector('.calc-contain')
			text.style['fontSize'] = '75px'
			if (append) {
				text.innerHTML = currentNum.data
			}

			font_size = 75
			while (text.clientWidth > calc_contain.clientWidth) {
				font_size -= 5
				text.setAttribute('style', `font-size: ${font_size}px`)
			}
		}

		if (input.classList.contains('other')) {
			if (!current_text.length) {
				return true
			}

			if (input.id == 'clear') {
				clearCurrent()
				return true
			} 
			if (input.id == 'percent') {
				if (isOperator()) {
					return true
				}
				if (currentNum) {
					currentNum.toPercent()
				}
			}
			if (input.id == 'neg-pos') {
				if (isOperator()) {
					return true
				}
				if (currentNum) {
					currentNum.toNegative()
				}
			}
		}
		if (input.classList.contains('nums')) {
			if (currentNum) {
				currentNum.append(input.innerHTML)

				if (currentNum.data.length >= 9 && currentNum.hasPeriod()) {
					preview_text.innerHTML = currentText()
					calc.querySelector('.text .current').innerHTML = ''
					return true
				}
			} else {
				currentNum = new NumberText(input.innerHTML)
				if (input.id == 'dot') {
					currentNum = new NumberText('0.')
				}

				current_text.push(currentNum)
				text.innerHTML = currentNum.number()
			}
		}
		if (input.classList.contains('ar')) {
			if (!current_text.length) {
				return true
			}

			if (input.id == 'equals') {
				if (isOperator()) {
					return true
				}
				
				let ans = math.evaluate(currentTextCalc())

				if (isNaN(ans) || ans == 'Infinity') {
					ans = 'Error'
				}

				clearCurrent()
				current_text.push(new NumberText(ans))
				text.innerHTML = ans
				resizeText()

				return true
			}

			if (isOperator()) {
				current_text.pop()
				current_text.push(input.innerHTML)
				preview_text.innerHTML = currentText()

				return true
			}
			current_text.push(input.innerHTML)
		}

		if (currentText) {
			resizeText(append=true)
		}

		if (current_text.length > 1) {
			preview_text.innerHTML = currentText()
		}
	
	}
}