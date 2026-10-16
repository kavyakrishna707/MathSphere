/**
 * MathSphere - Educational Mathematics Platform
 * Core JavaScript Engine (Vanilla JS, 0 external dependencies, No eval())
 * 
 * Modules:
 * 1. UI Infrastructure: Theme (Dark/Light), Mobile Menu, Toasts, Search & Filter
 * 2. Safe Mathematical Expression Parser & Scientific Calculator (AST / Shunting-Yard RPN)
 * 3. Matrix Calculator & Linear Algebra Engine
 * 4. Number System Converter with Step Generator
 * 5. Algebra Solver (Linear & Quadratic with Complex Roots)
 * 6. HTML5 Canvas Graph Plotter with Hover Tracking
 * 7. Interactive Math Quiz Engine
 * 8. Learning Hub Deep-linking & Utilities
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initThemeAndUI();
  initMathRendering();
  initSearchAndFilter();
  initScientificCalculator();
  initMatrixCalculator();
  initNumberConverter();
  initAlgebraSolver();
  initGraphPlotter();
  initQuiz();
  initLearningHubLinks();
});

/* ==========================================================================
   MODULE 0: KATEX MATH RENDERING CONFIGURATION
   ========================================================================== */

/**
 * KaTeX Math Notation Renderer
 * Scans the provided DOM element and converts LaTeX delimiters:
 * - Display math: $$...$$ and \[...\]
 * - Inline math: $...$ and \(...\)
 */
function renderMath(element = document.body) {
  if (typeof renderMathInElement === 'function') {
    try {
      renderMathInElement(element, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    } catch (err) {
      console.warn('KaTeX rendering notice:', err);
    }
  }
}

function initMathRendering() {
  if (typeof renderMathInElement === 'function') {
    renderMath(document.body);
  } else {
    // Retry once deferred scripts finish loading
    window.addEventListener('load', () => renderMath(document.body));
    const timer = setInterval(() => {
      if (typeof renderMathInElement === 'function') {
        clearInterval(timer);
        renderMath(document.body);
      }
    }, 50);
    setTimeout(() => clearInterval(timer), 3000);
  }
}

/* ==========================================================================
   MODULE 1: UI INFRASTRUCTURE (Theme, Mobile Nav, Toast, Year)
   ========================================================================== */

function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function initThemeAndUI() {
  // Set copyright current year dynamically
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // Theme Toggle with localStorage
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to 'dark'
  const savedTheme = localStorage.getItem('mathsphere-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('mathsphere-theme', newTheme);
      showToast(`Switched to ${newTheme} theme`);

      // Trigger canvas re-render if graph plotter is initialized
      if (window.mathSphereRedrawPlot) {
        window.mathSphereRedrawPlot();
      }
    });
  }

  // Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');

  function openMobileMenu() {
    mobileDrawer.classList.add('open');
    mobileBackdrop.classList.add('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    mobileBackdrop.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
    mobileBackdrop.addEventListener('click', closeMobileMenu);

    // Close when clicking any nav link
    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // Keyboard ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   SEARCH & FILTER CARDS
   ========================================================================== */
function initSearchAndFilter() {
  const searchInput = document.getElementById('tool-search-input');
  const clearBtn = document.getElementById('search-clear-btn');
  const filterPills = document.querySelectorAll('.filter-pill');
  const toolCards = document.querySelectorAll('.tool-card');

  let activeCategory = 'all';

  function applyFilters() {
    const query = (searchInput.value || '').trim().toLowerCase();
    let matchCount = 0;

    toolCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const title = (card.querySelector('.tool-card-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.tool-card-desc')?.textContent || '').toLowerCase();

      const matchesCat = (activeCategory === 'all' || category === activeCategory);
      const matchesQuery = !query || title.includes(query) || desc.includes(query) || keywords.includes(query);

      if (matchesCat && matchesQuery) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      applyFilters();
      searchInput.focus();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      activeCategory = pill.getAttribute('data-filter');
      applyFilters();
    });
  });
}

/* ==========================================================================
   MODULE 2: SAFE MATHEMATICAL EVALUATOR & SCIENTIFIC CALCULATOR
   Zero eval() usage! Uses Shunting-Yard Algorithm & Reverse Polish Notation.
   ========================================================================== */

/**
 * Tokenizer for arithmetic, scientific functions, and parentheses
 */
function tokenizeExpression(expr) {
  const tokens = [];
  let i = 0;
  const s = expr.replace(/\s+/g, '');

  while (i < s.length) {
    const c = s[i];

    // Number (integer or decimal)
    if (/[0-9]/.test(c) || (c === '.' && i + 1 < s.length && /[0-9]/.test(s[i + 1]))) {
      let numStr = '';
      while (i < s.length && (/[0-9]/.test(s[i]) || s[i] === '.')) {
        numStr += s[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
      continue;
    }

    // Identifiers (functions or constants: sin, cos, tan, ln, log, sqrt, pi, e, etc.)
    if (/[a-zA-Z]/.test(c)) {
      let idStr = '';
      while (i < s.length && /[a-zA-Z0-9]/.test(s[i])) {
        idStr += s[i];
        i++;
      }
      const lower = idStr.toLowerCase();
      if (lower === 'pi') {
        tokens.push({ type: 'NUMBER', value: Math.PI });
      } else if (lower === 'e') {
        tokens.push({ type: 'NUMBER', value: Math.E });
      } else {
        tokens.push({ type: 'FUNCTION', value: lower });
      }
      continue;
    }

    // Operators and Parentheses
    if ('+-*/%^()'.includes(c)) {
      // Determine if '-' is unary negation
      if (c === '-') {
        const prev = tokens[tokens.length - 1];
        if (!prev || prev.type === 'OPERATOR' || (prev.type === 'PAREN' && prev.value === '(')) {
          tokens.push({ type: 'UNARY_MINUS', value: 'u-' });
          i++;
          continue;
        }
      }

      if (c === '(' || c === ')') {
        tokens.push({ type: 'PAREN', value: c });
      } else {
        tokens.push({ type: 'OPERATOR', value: c });
      }
      i++;
      continue;
    }

    // Unknown character
    throw new Error(`Invalid symbol '${c}' in expression`);
  }

  return tokens;
}

/**
 * Shunting-Yard algorithm: converts Infix tokens to Postfix (RPN) tokens
 */
function infixToRPN(tokens) {
  const outputQueue = [];
  const opStack = [];

  const precedence = {
    '+': 2,
    '-': 2,
    '*': 3,
    '/': 3,
    '%': 3,
    '^': 4,
    'u-': 5
  };

  const rightAssociative = {
    '^': true,
    'u-': true
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'NUMBER') {
      outputQueue.push(token);
    } else if (token.type === 'FUNCTION') {
      opStack.push(token);
    } else if (token.type === 'UNARY_MINUS' || token.type === 'OPERATOR') {
      const o1 = token.value;
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1];
        if (top.type === 'FUNCTION') {
          outputQueue.push(opStack.pop());
          continue;
        }
        if (top.type === 'OPERATOR' || top.type === 'UNARY_MINUS') {
          const o2 = top.value;
          const p1 = precedence[o1] || 0;
          const p2 = precedence[o2] || 0;
          if ((!rightAssociative[o1] && p1 <= p2) || (rightAssociative[o1] && p1 < p2)) {
            outputQueue.push(opStack.pop());
            continue;
          }
        }
        break;
      }
      opStack.push(token);
    } else if (token.type === 'PAREN' && token.value === '(') {
      opStack.push(token);
    } else if (token.type === 'PAREN' && token.value === ')') {
      let matched = false;
      while (opStack.length > 0) {
        const top = opStack.pop();
        if (top.type === 'PAREN' && top.value === '(') {
          matched = true;
          break;
        }
        outputQueue.push(top);
      }
      if (!matched) {
        throw new Error('Mismatched parentheses: extra closing parenthesis');
      }
      // If there is a function token at the top of the stack, pop it onto the output queue
      if (opStack.length > 0 && opStack[opStack.length - 1].type === 'FUNCTION') {
        outputQueue.push(opStack.pop());
      }
    }
  }

  while (opStack.length > 0) {
    const top = opStack.pop();
    if (top.type === 'PAREN') {
      throw new Error('Mismatched parentheses: unclosed open parenthesis');
    }
    outputQueue.push(top);
  }

  return outputQueue;
}

/**
 * Evaluates RPN token queue safely without eval()
 */
function evaluateRPN(rpnTokens, angleMode = 'DEG') {
  const stack = [];

  function toRadians(angle) {
    return angleMode === 'DEG' ? (angle * Math.PI) / 180 : angle;
  }

  for (let i = 0; i < rpnTokens.length; i++) {
    const token = rpnTokens[i];

    if (token.type === 'NUMBER') {
      stack.push(token.value);
    } else if (token.type === 'UNARY_MINUS') {
      if (stack.length < 1) throw new Error('Syntax error: invalid negative sign placement');
      const val = stack.pop();
      stack.push(-val);
    } else if (token.type === 'OPERATOR') {
      if (stack.length < 2) throw new Error(`Syntax error near '${token.value}'`);
      const b = stack.pop();
      const a = stack.pop();

      switch (token.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/':
          if (Math.abs(b) < 1e-15) throw new Error('Cannot divide by zero');
          stack.push(a / b);
          break;
        case '%':
          if (Math.abs(b) < 1e-15) throw new Error('Cannot perform modulo by zero');
          stack.push(a % b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error(`Unsupported operator '${token.value}'`);
      }
    } else if (token.type === 'FUNCTION') {
      if (stack.length < 1) throw new Error(`Missing argument for function ${token.value}()`);
      const arg = stack.pop();

      switch (token.value) {
        case 'sin':
          stack.push(Math.sin(toRadians(arg)));
          break;
        case 'cos':
          stack.push(Math.cos(toRadians(arg)));
          break;
        case 'tan': {
          const rad = toRadians(arg);
          // Check for undefined tangent at 90, 270 degrees etc.
          if (Math.abs(Math.cos(rad)) < 1e-12) {
            throw new Error('Undefined tangent (asymptote)');
          }
          stack.push(Math.tan(rad));
          break;
        }
        case 'sqrt':
          if (arg < 0) throw new Error('Cannot calculate square root of a negative real number');
          stack.push(Math.sqrt(arg));
          break;
        case 'cbrt':
          stack.push(Math.cbrt(arg));
          break;
        case 'ln':
          if (arg <= 0) throw new Error('Logarithm undefined for values <= 0');
          stack.push(Math.log(arg));
          break;
        case 'log':
          if (arg <= 0) throw new Error('Logarithm undefined for values <= 0');
          stack.push(Math.log10(arg));
          break;
        case 'abs':
          stack.push(Math.abs(arg));
          break;
        default:
          throw new Error(`Unknown mathematical function '${token.value}()'`);
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Incomplete expression or syntax error');
  }

  const result = stack[0];
  if (isNaN(result) || !isFinite(result)) {
    throw new Error('Result is undefined or exceeds floating point limit');
  }

  // Round floating point inaccuracies (e.g. 0.1 + 0.2 = 0.30000000000000004 -> 0.3)
  return Math.abs(result) < 1e-12 ? 0 : parseFloat(result.toPrecision(12)) / 1;
}

/**
 * Public parser function to evaluate arbitrary strings
 */
function safeEvaluateMathExpression(exprStr, angleMode = 'DEG') {
  if (!exprStr || !exprStr.trim()) return 0;
  const tokens = tokenizeExpression(exprStr);
  const rpn = infixToRPN(tokens);
  return evaluateRPN(rpn, angleMode);
}

function initScientificCalculator() {
  const exprDisplay = document.getElementById('calc-expression-display');
  const resultDisplay = document.getElementById('calc-result-display');
  const errorBanner = document.getElementById('calc-error-banner');
  const angleToggleBtn = document.getElementById('calc-angle-toggle');
  const angleText = document.getElementById('calc-angle-text');
  const angleBadge = document.getElementById('calc-angle-mode-badge');
  const copyBtn = document.getElementById('calc-copy-btn');
  const clearHistoryBtn = document.getElementById('calc-clear-history-btn');
  const historyList = document.getElementById('calc-history-list');
  const keys = document.querySelectorAll('.calc-key');

  let currentExpression = '';
  let angleMode = 'DEG';
  let history = [];

  function updateDisplay() {
    exprDisplay.textContent = currentExpression || '0';
    errorBanner.style.display = 'none';
  }

  function showError(msg) {
    errorBanner.textContent = `⚠️ ${msg}`;
    errorBanner.style.display = 'flex';
  }

  function handleCalculate() {
    if (!currentExpression.trim()) return;
    try {
      const result = safeEvaluateMathExpression(currentExpression, angleMode);
      resultDisplay.textContent = result.toString();
      errorBanner.style.display = 'none';

      // Save to history
      history.unshift({ exp: currentExpression, res: result });
      if (history.length > 10) history.pop();
      renderHistory();

      // Set expression to answer for chaining
      currentExpression = result.toString();
    } catch (err) {
      showError(err.message || 'Calculation error');
    }
  }

  function renderHistory() {
    if (!historyList) return;
    if (history.length === 0) {
      historyList.innerHTML = `<div class="history-empty">No calculations yet. Perform an operation to see history.</div>`;
      return;
    }
    historyList.innerHTML = '';
    history.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'history-item';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Restore ${item.exp} equals ${item.res}`);
      card.innerHTML = `
        <div class="history-exp">${item.exp} =</div>
        <div class="history-res">${item.res}</div>
      `;
      card.addEventListener('click', () => {
        currentExpression = item.res.toString();
        resultDisplay.textContent = item.res.toString();
        updateDisplay();
        showToast('Restored calculation from history');
      });
      historyList.appendChild(card);
    });
  }

  // Keypad clicks
  keys.forEach(key => {
    key.addEventListener('click', () => {
      const action = key.getAttribute('data-action');
      const val = key.getAttribute('data-value');

      if (action === 'insert') {
        currentExpression += val;
        updateDisplay();
      } else if (action === 'insert-fn') {
        currentExpression += val;
        updateDisplay();
      } else if (action === 'all-clear') {
        currentExpression = '';
        resultDisplay.textContent = '0';
        updateDisplay();
      } else if (action === 'clear-entry') {
        currentExpression = '';
        updateDisplay();
      } else if (action === 'backspace') {
        currentExpression = currentExpression.slice(0, -1);
        updateDisplay();
      } else if (action === 'negate') {
        if (!currentExpression) {
          currentExpression = '-';
        } else if (currentExpression.startsWith('-')) {
          currentExpression = currentExpression.slice(1);
        } else {
          currentExpression = '-' + currentExpression;
        }
        updateDisplay();
      } else if (action === 'calculate') {
        handleCalculate();
      }
    });
  });

  // Angle Mode Toggle
  if (angleToggleBtn) {
    angleToggleBtn.addEventListener('click', () => {
      angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
      angleText.textContent = angleMode;
      angleBadge.textContent = angleMode;
      showToast(`Angle unit set to ${angleMode === 'DEG' ? 'Degrees' : 'Radians'}`);
    });
  }

  // Copy result
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = resultDisplay.textContent;
      if (text && text !== '0') {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied ${text} to clipboard!`);
        });
      }
    });
  }

  // Clear History
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      history = [];
      renderHistory();
      showToast('Calculator history cleared');
    });
  }

  // Global Keyboard listener for calculator
  document.addEventListener('keydown', (e) => {
    // Only capture if target is not a text input or textarea
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) {
      return;
    }

    if (e.key >= '0' && e.key <= '9') {
      currentExpression += e.key;
      updateDisplay();
    } else if (['+', '-', '*', '/', '%', '^', '(', ')', '.'].includes(e.key)) {
      currentExpression += e.key;
      updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      handleCalculate();
    } else if (e.key === 'Backspace') {
      currentExpression = currentExpression.slice(0, -1);
      updateDisplay();
    } else if (e.key === 'Escape') {
      currentExpression = '';
      resultDisplay.textContent = '0';
      updateDisplay();
    }
  });
}

/* ==========================================================================
   MODULE 3: MATRIX CALCULATOR & LINEAR ALGEBRA ENGINE
   ========================================================================== */

function initMatrixCalculator() {
  const rowsSelectA = document.getElementById('matrix-a-rows');
  const colsSelectA = document.getElementById('matrix-a-cols');
  const gridA = document.getElementById('matrix-a-grid');

  const rowsSelectB = document.getElementById('matrix-b-rows');
  const colsSelectB = document.getElementById('matrix-b-cols');
  const gridB = document.getElementById('matrix-b-grid');

  const errorBanner = document.getElementById('matrix-error-banner');
  const resultContainer = document.getElementById('matrix-result-container');
  const resultTitle = document.getElementById('matrix-result-title');
  const resultContent = document.getElementById('matrix-result-content');
  const explanationBox = document.getElementById('matrix-explanation-box');
  const copyResultBtn = document.getElementById('matrix-copy-result');

  // Operation buttons
  const btnAdd = document.getElementById('btn-matrix-add');
  const btnSub = document.getElementById('btn-matrix-sub');
  const btnMul = document.getElementById('btn-matrix-mul');
  const btnSwap = document.getElementById('btn-matrix-swap');

  const btnTransA = document.getElementById('btn-transpose-a');
  const btnDetA = document.getElementById('btn-det-a');
  const btnInvA = document.getElementById('btn-inv-a');

  const btnTransB = document.getElementById('btn-transpose-b');
  const btnDetB = document.getElementById('btn-det-b');
  const btnInvB = document.getElementById('btn-inv-b');

  let lastComputedMatrix = null;

  function renderGrid(gridElem, rows, cols, prefix, defaultValues = null) {
    gridElem.innerHTML = '';
    gridElem.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.step = 'any';
        input.className = 'matrix-cell-input';
        input.id = `${prefix}_${r}_${c}`;
        input.setAttribute('aria-label', `${prefix.toUpperCase()} row ${r+1} column ${c+1}`);
        
        let initialVal = 0;
        if (defaultValues && defaultValues[r] && defaultValues[r][c] !== undefined) {
          initialVal = defaultValues[r][c];
        } else if (r === c) {
          initialVal = 1; // Default to identity for square
        }
        input.value = initialVal;
        gridElem.appendChild(input);
      }
    }
  }

  function getMatrixValues(prefix, rows, cols) {
    const matrix = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const input = document.getElementById(`${prefix}_${r}_${c}`);
        const val = parseFloat(input ? input.value : 0);
        row.push(isNaN(val) ? 0 : val);
      }
      matrix.push(row);
    }
    return matrix;
  }

  function setMatrixValues(prefix, matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    if (prefix === 'a') {
      rowsSelectA.value = rows;
      colsSelectA.value = cols;
      renderGrid(gridA, rows, cols, 'a', matrix);
    } else {
      rowsSelectB.value = rows;
      colsSelectB.value = cols;
      renderGrid(gridB, rows, cols, 'b', matrix);
    }
  }

  function showMatrixError(msg) {
    errorBanner.textContent = `⚠️ Matrix Error: ${msg}`;
    errorBanner.style.display = 'flex';
    resultContainer.style.display = 'none';
  }

  function hideMatrixError() {
    errorBanner.style.display = 'none';
  }

  function displayMatrixResult(title, matrix, explanation) {
    hideMatrixError();
    resultTitle.textContent = title;
    explanationBox.innerHTML = explanation;
    resultContainer.style.display = 'block';
    lastComputedMatrix = matrix;
    renderMath(explanationBox);

    if (typeof matrix === 'number') {
      // Scalar result (like determinant)
      resultContent.innerHTML = `<div style="font-size:2rem; font-weight:800; font-family:var(--font-mono); color:var(--accent-cyan); text-align:center;">${matrix}</div>`;
      return;
    }

    // Build visual bracket matrix table
    let tableHtml = `<table class="matrix-bracket-table">`;
    for (let r = 0; r < matrix.length; r++) {
      tableHtml += `<tr>`;
      for (let c = 0; c < matrix[r].length; c++) {
        // Round to 4 decimal places if fractional
        let cellVal = matrix[r][c];
        if (typeof cellVal === 'number') {
          cellVal = Math.abs(cellVal) < 1e-10 ? 0 : parseFloat(cellVal.toFixed(4));
        }
        tableHtml += `<td class="matrix-result-cell">${cellVal}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</table>`;
    resultContent.innerHTML = tableHtml;
  }

  // --- Linear Algebra Math Operations ---

  function addMatrices(A, B) {
    const rA = A.length, cA = A[0].length;
    const rB = B.length, cB = B[0].length;
    if (rA !== rB || cA !== cB) {
      throw new Error(`Addition requires identical dimensions. Matrix A is ${rA}×${cA} while Matrix B is ${rB}×${cB}.`);
    }
    const res = [];
    for (let i = 0; i < rA; i++) {
      const row = [];
      for (let j = 0; j < cA; j++) {
        row.push(A[i][j] + B[i][j]);
      }
      res.push(row);
    }
    return res;
  }

  function subtractMatrices(A, B) {
    const rA = A.length, cA = A[0].length;
    const rB = B.length, cB = B[0].length;
    if (rA !== rB || cA !== cB) {
      throw new Error(`Subtraction requires identical dimensions. Matrix A is ${rA}×${cA} while Matrix B is ${rB}×${cB}.`);
    }
    const res = [];
    for (let i = 0; i < rA; i++) {
      const row = [];
      for (let j = 0; j < cA; j++) {
        row.push(A[i][j] - B[i][j]);
      }
      res.push(row);
    }
    return res;
  }

  function multiplyMatrices(A, B) {
    const rA = A.length, cA = A[0].length;
    const rB = B.length, cB = B[0].length;
    if (cA !== rB) {
      throw new Error(`Matrix multiplication (A × B) requires columns of A to equal rows of B. Matrix A has ${cA} column(s) but Matrix B has ${rB} row(s).`);
    }
    const res = [];
    for (let i = 0; i < rA; i++) {
      const row = [];
      for (let j = 0; j < cB; j++) {
        let sum = 0;
        for (let k = 0; k < cA; k++) {
          sum += A[i][k] * B[k][j];
        }
        row.push(sum);
      }
      res.push(row);
    }
    return res;
  }

  function transposeMatrix(A) {
    const rows = A.length, cols = A[0].length;
    const res = [];
    for (let c = 0; c < cols; c++) {
      const row = [];
      for (let r = 0; r < rows; r++) {
        row.push(A[r][c]);
      }
      res.push(row);
    }
    return res;
  }

  function determinant(M) {
    const n = M.length;
    if (n !== M[0].length) {
      throw new Error(`Determinant is only defined for square matrices. Matrix has dimensions ${n}×${M[0].length}.`);
    }
    if (n === 1) return M[0][0];
    if (n === 2) {
      return (M[0][0] * M[1][1]) - (M[0][1] * M[1][0]);
    }
    if (n === 3) {
      const [a, b, c] = M[0];
      const [d, e, f] = M[1];
      const [g, h, k] = M[2];
      return a * (e * k - f * h) - b * (d * k - f * g) + c * (d * h - e * g);
    }

    // General N x N via Gaussian Elimination with partial pivoting
    const A = M.map(row => [...row]);
    let det = 1;
    for (let i = 0; i < n; i++) {
      let pivot = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(A[j][i]) > Math.abs(A[pivot][i])) {
          pivot = j;
        }
      }
      if (Math.abs(A[pivot][i]) < 1e-12) return 0;
      if (pivot !== i) {
        [A[i], A[pivot]] = [A[pivot], A[i]];
        det = -det;
      }
      det *= A[i][i];
      for (let j = i + 1; j < n; j++) {
        const factor = A[j][i] / A[i][i];
        for (let k = i; k < n; k++) {
          A[j][k] -= factor * A[i][k];
        }
      }
    }
    return Math.abs(det) < 1e-10 ? 0 : parseFloat(det.toFixed(6));
  }

  function inverseMatrix(M) {
    const n = M.length;
    if (n !== M[0].length) {
      throw new Error(`Only square matrices have an inverse. Matrix is ${n}×${M[0].length}.`);
    }
    const det = determinant(M);
    if (Math.abs(det) < 1e-12) {
      throw new Error(`The matrix is singular because its determinant is 0 (det = 0). Singular matrices do not possess a multiplicative inverse.`);
    }

    if (n === 1) {
      return [[1 / M[0][0]]];
    }

    if (n === 2) {
      const a = M[0][0], b = M[0][1], c = M[1][0], d = M[1][1];
      return [
        [d / det, -b / det],
        [-c / det, a / det]
      ];
    }

    // Gauss-Jordan elimination for 3x3 and 4x4
    const augmented = M.map((row, i) => {
      const identityRow = new Array(n).fill(0);
      identityRow[i] = 1;
      return [...row, ...identityRow];
    });

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

      const pivot = augmented[i][i];
      if (Math.abs(pivot) < 1e-12) {
        throw new Error('Matrix is numerically singular; cannot compute inverse.');
      }
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }

    const inv = [];
    for (let i = 0; i < n; i++) {
      inv.push(augmented[i].slice(n));
    }
    return inv;
  }

  // Dimension Change Listeners
  function updateGridA() {
    renderGrid(gridA, parseInt(rowsSelectA.value), parseInt(colsSelectA.value), 'a');
  }
  function updateGridB() {
    renderGrid(gridB, parseInt(rowsSelectB.value), parseInt(colsSelectB.value), 'b');
  }

  rowsSelectA.addEventListener('change', updateGridA);
  colsSelectA.addEventListener('change', updateGridA);
  rowsSelectB.addEventListener('change', updateGridB);
  colsSelectB.addEventListener('change', updateGridB);

  // Initial render
  updateGridA();
  updateGridB();

  // Operation Event Handlers
  btnAdd.addEventListener('click', () => {
    try {
      const A = getMatrixValues('a', parseInt(rowsSelectA.value), parseInt(colsSelectA.value));
      const B = getMatrixValues('b', parseInt(rowsSelectB.value), parseInt(colsSelectB.value));
      const res = addMatrices(A, B);
      displayMatrixResult(
        'Addition Result: A + B',
        res,
        `<strong>Matrix Addition:</strong> Computed by adding corresponding entries: $C_{ij} = A_{ij} + B_{ij}$. Dimensions remain identical (${res.length}×${res[0].length}).`
      );
    } catch (err) {
      showMatrixError(err.message);
    }
  });

  btnSub.addEventListener('click', () => {
    try {
      const A = getMatrixValues('a', parseInt(rowsSelectA.value), parseInt(colsSelectA.value));
      const B = getMatrixValues('b', parseInt(rowsSelectB.value), parseInt(colsSelectB.value));
      const res = subtractMatrices(A, B);
      displayMatrixResult(
        'Subtraction Result: A − B',
        res,
        `<strong>Matrix Subtraction:</strong> Computed by subtracting each entry in B from the matching entry in A: $C_{ij} = A_{ij} - B_{ij}$.`
      );
    } catch (err) {
      showMatrixError(err.message);
    }
  });

  btnMul.addEventListener('click', () => {
    try {
      const A = getMatrixValues('a', parseInt(rowsSelectA.value), parseInt(colsSelectA.value));
      const B = getMatrixValues('b', parseInt(rowsSelectB.value), parseInt(colsSelectB.value));
      const res = multiplyMatrices(A, B);
      displayMatrixResult(
        'Multiplication Result: A × B',
        res,
        `<strong>Matrix Multiplication:</strong> Computed by dot product of row $i$ of Matrix A with column $j$ of Matrix B: $C_{ij} = \\sum_{k} A_{ik} B_{kj}$. Result size is ${res.length}×${res[0].length}.`
      );
    } catch (err) {
      showMatrixError(err.message);
    }
  });

  btnSwap.addEventListener('click', () => {
    const A = getMatrixValues('a', parseInt(rowsSelectA.value), parseInt(colsSelectA.value));
    const B = getMatrixValues('b', parseInt(rowsSelectB.value), parseInt(colsSelectB.value));
    setMatrixValues('a', B);
    setMatrixValues('b', A);
    showToast('Swapped Matrix A and Matrix B');
  });

  btnTransA.addEventListener('click', () => {
    try {
      const A = getMatrixValues('a', parseInt(rowsSelectA.value), parseInt(colsSelectA.value));
      const res = transposeMatrix(A);
      displayMatrixResult(
        'Transpose Result: Aᵀ',
        res,
        `<strong>Transpose:</strong> Swapped rows and columns of Matrix A: $A^T_{ij} = A_{ji}$. New dimensions: ${res.length}×${res[0].length}.`
      );
    } catch (err) {
      showMatrixError(err.message);
    }
  });

  btnTransB.addEventListener('click', () => {
    try {
      const B = getMatrixValues('b', parseInt(rowsSelectB.value), parseInt(colsSelectB.value));
      const res = transposeMatrix(B);
      displayMatrixResult(
        'Transpose Result: Bᵀ',
        res,
        `<strong>Transpose:</strong> Swapped rows and columns of Matrix B: $B^T_{ij} = B_{ji}$. New dimensions: ${res.length}×${res[0].length}.`
      );
    } catch (err) {
      showMatrixError(err.message);
    }
  });

  btnDetA.addEventListener('click', () => {
    try {
      const A = getMatrixValues('a', parseInt(rowsSelectA.value), parseInt(colsSelectA.value));
      const detVal = determinant(A);
      displayMatrixResult(
        'Determinant: det(A)',
        detVal,
        `<strong>Determinant:</strong> $\\det(A) = ${detVal}$. ${detVal !== 0 ? 'Since $\\det(A) \\neq 0$, the matrix is non-singular and invertible.' : 'Since $\\det(A) = 0$, the matrix is singular and cannot be inverted.'}`
      );
    } catch (err) {
      showMatrixError(err.message);
    }
  });

  btnDetB.addEventListener('click', () => {
    try {
      const B = getMatrixValues('b', parseInt(rowsSelectB.value), parseInt(colsSelectB.value));
      const detVal = determinant(B);
      displayMatrixResult(
        'Determinant: det(B)',
        detVal,
        `<strong>Determinant:</strong> $\\det(B) = ${detVal}$. ${detVal !== 0 ? 'Matrix B is non-singular.' : 'Matrix B is singular ($\\det(B) = 0$).'}`
      );
    } catch (err) {
      showMatrixError(err.message);
    }
  });

  btnInvA.addEventListener('click', () => {
    try {
      const A = getMatrixValues('a', parseInt(rowsSelectA.value), parseInt(colsSelectA.value));
      const inv = inverseMatrix(A);
      displayMatrixResult(
        'Inverse Matrix: A⁻¹',
        inv,
        `<strong>Inverse:</strong> $A \\cdot A^{-1} = I$. The inverse exists because $\\det(A) \\neq 0$.`
      );
    } catch (err) {
      showMatrixError(err.message);
    }
  });

  btnInvB.addEventListener('click', () => {
    try {
      const B = getMatrixValues('b', parseInt(rowsSelectB.value), parseInt(colsSelectB.value));
      const inv = inverseMatrix(B);
      displayMatrixResult(
        'Inverse Matrix: B⁻¹',
        inv,
        `<strong>Inverse:</strong> $B \\cdot B^{-1} = I$. The inverse exists because $\\det(B) \\neq 0$.`
      );
    } catch (err) {
      showMatrixError(err.message);
    }
  });

  // Presets
  const presetBtns = document.querySelectorAll('[data-matrix-preset]');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-matrix-preset');
      if (preset === 'identity2') {
        setMatrixValues('a', [[1, 0], [0, 1]]);
        setMatrixValues('b', [[1, 0], [0, 1]]);
      } else if (preset === 'identity3') {
        setMatrixValues('a', [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        setMatrixValues('b', [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
      } else if (preset === 'system2') {
        setMatrixValues('a', [[2, 1], [5, 3]]);
        setMatrixValues('b', [[3, -1], [-5, 2]]);
      } else if (preset === 'system3') {
        setMatrixValues('a', [[1, 2, -1], [2, 1, 1], [-1, 1, 2]]);
        setMatrixValues('b', [[1, 0, 1], [0, 2, 1], [1, 1, 0]]);
      } else if (preset === 'random') {
        const rand = (r, c) => Array.from({ length: r }, () => Array.from({ length: c }, () => Math.floor(Math.random() * 11) - 5));
        setMatrixValues('a', rand(2, 2));
        setMatrixValues('b', rand(2, 2));
      } else if (preset === 'clear') {
        const rA = parseInt(rowsSelectA.value), cA = parseInt(colsSelectA.value);
        const rB = parseInt(rowsSelectB.value), cB = parseInt(colsSelectB.value);
        setMatrixValues('a', Array.from({ length: rA }, () => new Array(cA).fill(0)));
        setMatrixValues('b', Array.from({ length: rB }, () => new Array(cB).fill(0)));
      }
      showToast('Loaded matrix preset');
    });
  });

  // Copy Result
  if (copyResultBtn) {
    copyResultBtn.addEventListener('click', () => {
      if (!lastComputedMatrix) return;
      let text = '';
      if (typeof lastComputedMatrix === 'number') {
        text = lastComputedMatrix.toString();
      } else {
        text = lastComputedMatrix.map(row => row.join('\t')).join('\n');
      }
      navigator.clipboard.writeText(text).then(() => {
        showToast('Matrix values copied to clipboard!');
      });
    });
  }
}

/* ==========================================================================
   MODULE 4: NUMBER SYSTEM CONVERTER WITH STEP-BY-STEP GENERATOR
   ========================================================================== */

function initNumberConverter() {
  const decInput = document.getElementById('conv-dec-input');
  const binInput = document.getElementById('conv-bin-input');
  const octInput = document.getElementById('conv-oct-input');
  const hexInput = document.getElementById('conv-hex-input');
  const validationMsg = document.getElementById('conv-validation-msg');
  const stepsOutput = document.getElementById('conv-steps-output');
  const clearBtn = document.getElementById('conv-clear-btn');
  const sampleBtns = document.querySelectorAll('.sample-btn');
  const stepTabs = document.querySelectorAll('.steps-tab');

  let currentDecValue = 255;
  let activeStepView = 'dec-to-bin';

  // Validation regex
  const validators = {
    dec: /^-?[0-9]+$/,
    bin: /^[01]+$/,
    oct: /^[0-7]+$/,
    hex: /^[0-9a-fA-F]+$/
  };

  function showValidation(msg) {
    if (msg) {
      validationMsg.textContent = `⚠️ ${msg}`;
      validationMsg.style.display = 'flex';
    } else {
      validationMsg.style.display = 'none';
    }
  }

  function clearInvalidStates() {
    [decInput, binInput, octInput, hexInput].forEach(inp => inp.classList.remove('input-invalid'));
    showValidation(null);
  }

  function updateFromDecimal(val, origin = '') {
    clearInvalidStates();
    if (isNaN(val) || val === null || val < 0) {
      if (origin !== 'dec') decInput.value = '';
      if (origin !== 'bin') binInput.value = '';
      if (origin !== 'oct') octInput.value = '';
      if (origin !== 'hex') hexInput.value = '';
      stepsOutput.innerHTML = `<div class="steps-placeholder">Enter a non-negative integer above to see calculation steps.</div>`;
      currentDecValue = null;
      return;
    }

    currentDecValue = val;
    if (origin !== 'dec') decInput.value = val.toString(10);
    if (origin !== 'bin') binInput.value = val.toString(2);
    if (origin !== 'oct') octInput.value = val.toString(8);
    if (origin !== 'hex') hexInput.value = val.toString(16).toUpperCase();

    renderSteps();
  }

  function renderSteps() {
    if (currentDecValue === null || isNaN(currentDecValue)) {
      stepsOutput.innerHTML = `<div class="steps-placeholder">Enter a valid integer to see mathematical steps.</div>`;
      return;
    }

    const n = Math.floor(currentDecValue);
    let html = '';

    if (activeStepView === 'dec-to-bin') {
      html += `<h4>Decimal to Binary Conversion (Repeated Division by 2)</h4>`;
      html += `<p class="text-sm text-muted">Divide by 2 successively, recording quotients and remainders until quotient is 0. Read remainders from bottom to top.</p>`;
      html += `<table class="step-table"><thead><tr><th>Division</th><th>Quotient</th><th>Remainder</th><th>Bit Pos</th></tr></thead><tbody>`;

      let temp = n;
      let pos = 0;
      const remainders = [];
      if (temp === 0) {
        html += `<tr><td>0 ÷ 2</td><td>0</td><td>0</td><td>2⁰</td></tr>`;
        remainders.push(0);
      } else {
        while (temp > 0) {
          const q = Math.floor(temp / 2);
          const r = temp % 2;
          remainders.push(r);
          html += `<tr><td>${temp} ÷ 2</td><td>${q}</td><td><strong>${r}</strong></td><td>2<sup>${pos}</sup></td></tr>`;
          temp = q;
          pos++;
        }
      }
      html += `</tbody></table>`;
      const binResult = remainders.slice().reverse().join('');
      html += `<div class="solution-highlight">Result: (${n})₁₀ = (${binResult})₂</div>`;

    } else if (activeStepView === 'dec-to-hex') {
      html += `<h4>Decimal to Hexadecimal Conversion (Repeated Division by 16)</h4>`;
      html += `<p class="text-sm text-muted">Divide by 16 successively. Map remainders 10-15 to letters A-F. Read remainders bottom to top.</p>`;
      html += `<table class="step-table"><thead><tr><th>Division</th><th>Quotient</th><th>Remainder</th><th>Hex Digit</th></tr></thead><tbody>`;

      const hexDigits = '0123456789ABCDEF';
      let temp = n;
      const hexArr = [];
      if (temp === 0) {
        html += `<tr><td>0 ÷ 16</td><td>0</td><td>0</td><td>0</td></tr>`;
        hexArr.push('0');
      } else {
        while (temp > 0) {
          const q = Math.floor(temp / 16);
          const r = temp % 16;
          const digit = hexDigits[r];
          hexArr.push(digit);
          html += `<tr><td>${temp} ÷ 16</td><td>${q}</td><td>${r}</td><td><strong>${digit}</strong></td></tr>`;
          temp = q;
        }
      }
      html += `</tbody></table>`;
      const hexResult = hexArr.slice().reverse().join('');
      html += `<div class="solution-highlight">Result: (${n})₁₀ = (0x${hexResult})₁₆</div>`;

    } else if (activeStepView === 'dec-to-oct') {
      html += `<h4>Decimal to Octal Conversion (Repeated Division by 8)</h4>`;
      html += `<table class="step-table"><thead><tr><th>Division</th><th>Quotient</th><th>Remainder</th></tr></thead><tbody>`;

      let temp = n;
      const octArr = [];
      if (temp === 0) {
        html += `<tr><td>0 ÷ 8</td><td>0</td><td>0</td></tr>`;
        octArr.push(0);
      } else {
        while (temp > 0) {
          const q = Math.floor(temp / 8);
          const r = temp % 8;
          octArr.push(r);
          html += `<tr><td>${temp} ÷ 8</td><td>${q}</td><td><strong>${r}</strong></td></tr>`;
          temp = q;
        }
      }
      html += `</tbody></table>`;
      const octResult = octArr.slice().reverse().join('');
      html += `<div class="solution-highlight">Result: (${n})₁₀ = (${octResult})₈</div>`;

    } else if (activeStepView === 'bin-to-dec') {
      const binStr = n.toString(2);
      html += `<h4>Binary to Decimal Positional Expansion</h4>`;
      html += `<p class="text-sm text-muted">Multiply each bit by 2 raised to its position exponent.</p>`;
      html += `<div style="background:var(--bg-secondary); padding:12px; border-radius:6px; margin:12px 0;">`;
      
      const parts = [];
      let total = 0;
      for (let i = 0; i < binStr.length; i++) {
        const bit = parseInt(binStr[i]);
        const power = binStr.length - 1 - i;
        const val = bit * Math.pow(2, power);
        total += val;
        parts.push(`(${bit} × 2<sup>${power}</sup> = ${val})`);
      }
      html += parts.join(' + <br>');
      html += `</div>`;
      html += `<div class="solution-highlight">Sum: (${binStr})₂ = ${total}₁₀</div>`;
    }

    stepsOutput.innerHTML = html;
  }

  // Input event listeners with instant validation
  decInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (!val) return updateFromDecimal(null, 'dec');
    if (!validators.dec.test(val)) {
      decInput.classList.add('input-invalid');
      showValidation('Decimal input can only contain digits 0-9.');
      return;
    }
    updateFromDecimal(parseInt(val, 10), 'dec');
  });

  binInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (!val) return updateFromDecimal(null, 'bin');
    if (!validators.bin.test(val)) {
      binInput.classList.add('input-invalid');
      showValidation('Binary input can only contain bits 0 and 1.');
      return;
    }
    updateFromDecimal(parseInt(val, 2), 'bin');
  });

  octInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (!val) return updateFromDecimal(null, 'oct');
    if (!validators.oct.test(val)) {
      octInput.classList.add('input-invalid');
      showValidation('Octal input can only contain octal digits 0-7.');
      return;
    }
    updateFromDecimal(parseInt(val, 8), 'oct');
  });

  hexInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (!val) return updateFromDecimal(null, 'hex');
    if (!validators.hex.test(val)) {
      hexInput.classList.add('input-invalid');
      showValidation('Hexadecimal input can only contain 0-9 and letters A-F.');
      return;
    }
    updateFromDecimal(parseInt(val, 16), 'hex');
  });

  // Step Tabs
  stepTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      stepTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeStepView = tab.getAttribute('data-step-view');
      renderSteps();
    });
  });

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      decInput.value = '';
      binInput.value = '';
      octInput.value = '';
      hexInput.value = '';
      updateFromDecimal(null);
      showToast('Cleared all converter fields');
    });
  }

  // Sample buttons
  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-val'), 10);
      updateFromDecimal(val);
      showToast(`Loaded sample value ${val}`);
    });
  });

  // Copy Buttons
  const copyBtns = document.querySelectorAll('.conv-copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input && input.value) {
        navigator.clipboard.writeText(input.value).then(() => {
          showToast(`Copied ${input.value} to clipboard!`);
        });
      }
    });
  });

  // Initial load
  updateFromDecimal(255);
}

/* ==========================================================================
   MODULE 5: ALGEBRA SOLVER (LINEAR & QUADRATIC EQUATIONS)
   ========================================================================== */

function initAlgebraSolver() {
  const tabLinear = document.getElementById('tab-linear');
  const tabQuadratic = document.getElementById('tab-quadratic');
  const panelLinear = document.getElementById('panel-linear');
  const panelQuadratic = document.getElementById('panel-quadratic');

  // Tab switching
  tabLinear.addEventListener('click', () => {
    tabLinear.classList.add('active');
    tabLinear.setAttribute('aria-selected', 'true');
    tabQuadratic.classList.remove('active');
    tabQuadratic.setAttribute('aria-selected', 'false');
    panelLinear.style.display = 'block';
    panelQuadratic.style.display = 'none';
  });

  tabQuadratic.addEventListener('click', () => {
    tabQuadratic.classList.add('active');
    tabQuadratic.setAttribute('aria-selected', 'true');
    tabLinear.classList.remove('active');
    tabLinear.setAttribute('aria-selected', 'false');
    panelQuadratic.style.display = 'block';
    panelLinear.style.display = 'none';
  });

  // --- Linear Solver ---
  const linA = document.getElementById('lin-a');
  const linB = document.getElementById('lin-b');
  const linC = document.getElementById('lin-c');
  const btnSolveLinear = document.getElementById('btn-solve-linear');
  const linearOutput = document.getElementById('linear-solution-output');

  function solveLinear() {
    const a = parseFloat(linA.value);
    const b = parseFloat(linB.value);
    const c = parseFloat(linC.value);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      linearOutput.innerHTML = `<div class="alert-banner alert-error">Please enter valid numerical coefficients.</div>`;
      linearOutput.style.display = 'block';
      return;
    }

    let html = `<h4 class="solution-header">Solution for Linear Equation: $${a}x + (${b}) = ${c}$</h4>`;

    // Special case a == 0
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b - c) < 1e-12) {
        html += `<div class="solution-step"><strong>Special Case ($a = 0$):</strong> The equation simplifies to $${b} = ${c}$, which is an identity (always true).</div>`;
        html += `<div class="solution-highlight">Infinite Solutions: Any real number $x$ satisfies the equation.</div>`;
      } else {
        html += `<div class="solution-step"><strong>Special Case ($a = 0$):</strong> The equation simplifies to $${b} = ${c}$, which is a mathematical contradiction ($${b} \\neq ${c}$).</div>`;
        html += `<div class="solution-highlight" style="border-left-color:var(--error); color:var(--error);">No Solution: The solution set is empty ($\\emptyset$).</div>`;
      }
    } else {
      const step1Right = c - b;
      const x = step1Right / a;
      const formattedX = Math.abs(x) < 1e-12 ? 0 : parseFloat(x.toFixed(6));

      html += `<div class="solution-step"><strong>Step 1: Subtract constant $b$ ($${b}$) from both sides:</strong><br>
        $${a}x = ${c} - (${b})$<br>
        $${a}x = ${step1Right}$
      </div>`;

      html += `<div class="solution-step"><strong>Step 2: Divide both sides by coefficient $a$ ($${a}$):</strong><br>
        $x = \\frac{${step1Right}}{${a}}$
      </div>`;

      html += `<div class="solution-highlight">Exact Solution: $x = ${formattedX}$</div>`;
    }

    linearOutput.innerHTML = html;
    linearOutput.style.display = 'block';
    renderMath(linearOutput);
  }

  btnSolveLinear.addEventListener('click', solveLinear);

  // Preset linear buttons
  document.querySelectorAll('[data-load-linear]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [a, b, c] = btn.getAttribute('data-load-linear').split(',');
      linA.value = a;
      linB.value = b;
      linC.value = c;
      solveLinear();
    });
  });

  // --- Quadratic Solver ---
  const quadA = document.getElementById('quad-a');
  const quadB = document.getElementById('quad-b');
  const quadC = document.getElementById('quad-c');
  const btnSolveQuad = document.getElementById('btn-solve-quadratic');
  const quadOutput = document.getElementById('quadratic-solution-output');

  function solveQuadratic() {
    const a = parseFloat(quadA.value);
    const b = parseFloat(quadB.value);
    const c = parseFloat(quadC.value);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      quadOutput.innerHTML = `<div class="alert-banner alert-error">Please enter valid numerical values for a, b, and c.</div>`;
      quadOutput.style.display = 'block';
      return;
    }

    let html = `<h4 class="solution-header">Solution for Quadratic: $(${a})x^2 + (${b})x + (${c}) = 0$</h4>`;

    // Case a = 0 (Linear degeneration)
    if (Math.abs(a) < 1e-12) {
      html += `<div class="solution-step"><strong>Linear Degeneration ($a = 0$):</strong> Since coefficient $a = 0$, the quadratic term vanishes, reducing to a linear equation: $${b}x + ${c} = 0$.</div>`;
      if (Math.abs(b) < 1e-12) {
        if (Math.abs(c) < 1e-12) {
          html += `<div class="solution-highlight">Infinite Solutions (Identity $0 = 0$).</div>`;
        } else {
          html += `<div class="solution-highlight" style="border-left-color:var(--error); color:var(--error);">No Solution (Contradiction $${c} = 0$).</div>`;
        }
      } else {
        const xLinear = -c / b;
        html += `<div class="solution-highlight">Linear Root: $x = ${parseFloat(xLinear.toFixed(6))}$</div>`;
      }
      quadOutput.innerHTML = html;
      quadOutput.style.display = 'block';
      renderMath(quadOutput);
      return;
    }

    // Discriminant Delta = b^2 - 4ac
    const delta = (b * b) - (4 * a * c);
    html += `<div class="solution-step"><strong>Step 1: Compute the Discriminant ($\\Delta = b^2 - 4ac$):</strong><br>
      $\\Delta = (${b})^2 - 4(${a})(${c})$<br>
      $\\Delta = ${b * b} - (${4 * a * c}) = \\mathbf{${delta}}$
    </div>`;

    const twoA = 2 * a;
    const negB = -b;

    // Case 1: Delta > 0 (Two distinct real roots)
    if (delta > 0) {
      const sqrtDelta = Math.sqrt(delta);
      const x1 = (negB + sqrtDelta) / twoA;
      const x2 = (negB - sqrtDelta) / twoA;

      html += `<div class="solution-step"><strong>Step 2: Since $\\Delta > 0$, there are Two Distinct Real Roots:</strong><br>
        $x = \\frac{-(${b}) \\pm \\sqrt{${delta}}}{2(${a})}$<br>
        $x = \\frac{${negB} \\pm ${parseFloat(sqrtDelta.toFixed(6))}}{${twoA}}$
      </div>`;

      html += `<div class="solution-highlight">
        $x_1 = ${parseFloat(x1.toFixed(6))}$<br>
        $x_2 = ${parseFloat(x2.toFixed(6))}$
      </div>`;
    }
    // Case 2: Delta == 0 (One repeated real root)
    else if (Math.abs(delta) < 1e-12) {
      const x = negB / twoA;
      html += `<div class="solution-step"><strong>Step 2: Since $\\Delta = 0$, there is Exactly One Repeated Real Root:</strong><br>
        $x = -\\frac{b}{2a} = \\frac{${negB}}{${twoA}}$
      </div>`;

      html += `<div class="solution-highlight">Single Repeated Root: $x = ${parseFloat(x.toFixed(6))}$</div>`;
    }
    // Case 3: Delta < 0 (Complex conjugate roots)
    else {
      const realPart = negB / twoA;
      const imagPart = Math.sqrt(-delta) / Math.abs(twoA);

      html += `<div class="solution-step"><strong>Step 2: Since $\\Delta < 0$ (${delta}), the roots are Complex Conjugates ($u \\pm vi$):</strong><br>
        $x = \\frac{-b \\pm i\\sqrt{|\\Delta|}}{2a}$<br>
        $\\text{Real Part } (u) = \\frac{${negB}}{${twoA}} = ${parseFloat(realPart.toFixed(6))}$<br>
        $\\text{Imaginary Part } (v) = \\frac{\\sqrt{${-delta}}}{${Math.abs(twoA)}} = ${parseFloat(imagPart.toFixed(6))}$
      </div>`;

      html += `<div class="solution-highlight">
        $x_1 = ${parseFloat(realPart.toFixed(6))} + ${parseFloat(imagPart.toFixed(6))}i$<br>
        $x_2 = ${parseFloat(realPart.toFixed(6))} - ${parseFloat(imagPart.toFixed(6))}i$
      </div>`;
    }

    // Vertex analysis
    const vertexX = negB / twoA;
    const vertexY = (a * vertexX * vertexX) + (b * vertexX) + c;
    const direction = a > 0 ? 'opens upwards (minimum at vertex)' : 'opens downwards (maximum at vertex)';

    html += `<div class="solution-step" style="margin-top:16px;">
      <strong>Parabola Geometric Properties:</strong><br>
      • Vertex: $(${parseFloat(vertexX.toFixed(4))}, ${parseFloat(vertexY.toFixed(4))})$<br>
      • Axis of Symmetry: $x = ${parseFloat(vertexX.toFixed(4))}$<br>
      • Orientation: Parabola ${direction}.
    </div>`;

    quadOutput.innerHTML = html;
    quadOutput.style.display = 'block';
    renderMath(quadOutput);
  }

  btnSolveQuad.addEventListener('click', solveQuadratic);

  // Preset quadratic buttons
  document.querySelectorAll('[data-load-quad]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [a, b, c] = btn.getAttribute('data-load-quad').split(',');
      quadA.value = a;
      quadB.value = b;
      quadC.value = c;
      solveQuadratic();
    });
  });

  // Solve initial defaults
  solveLinear();
  solveQuadratic();
}

/* ==========================================================================
   MODULE 6: HTML5 CANVAS GRAPH PLOTTER
   Zero external libraries. Handles grid, axes, high-DPI, and hover tracking.
   ========================================================================== */

function initGraphPlotter() {
  const canvas = document.getElementById('math-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const presetSelect = document.getElementById('plot-preset-select');
  const customWrapper = document.getElementById('custom-function-wrapper');
  const customInput = document.getElementById('custom-func-input');
  const xminInput = document.getElementById('plot-xmin');
  const xmaxInput = document.getElementById('plot-xmax');
  const yminInput = document.getElementById('plot-ymin');
  const ymaxInput = document.getElementById('plot-ymax');
  const btnDraw = document.getElementById('btn-draw-graph');
  const btnReset = document.getElementById('btn-reset-graph');
  const btnDownload = document.getElementById('btn-download-canvas');
  const coordsDisplay = document.getElementById('hover-coords-display');
  const functionLabel = document.getElementById('canvas-function-label');

  let currentFunc = (x) => Math.pow(x, 2);
  let currentExprStr = 'x^2';
  let mouseWorldPos = null;

  function updateFunctionFromControls() {
    const preset = presetSelect.value;
    if (preset === 'custom') {
      customWrapper.style.display = 'block';
      const expr = customInput.value.trim() || 'x';
      currentExprStr = expr;
      functionLabel.textContent = `y = ${expr}`;
      currentFunc = (x) => {
        // Substitute x value safely using token parser
        const exprWithX = expr.replace(/\bx\b/gi, `(${x})`);
        try {
          return safeEvaluateMathExpression(exprWithX, 'RAD');
        } catch (e) {
          return NaN;
        }
      };
    } else {
      customWrapper.style.display = 'none';
      currentExprStr = preset;
      if (preset === 'x') {
        currentFunc = (x) => x;
        functionLabel.textContent = 'y = x';
      } else if (preset === 'x^2') {
        currentFunc = (x) => Math.pow(x, 2);
        functionLabel.textContent = 'y = x²';
      } else if (preset === 'x^3') {
        currentFunc = (x) => Math.pow(x, 3);
        functionLabel.textContent = 'y = x³';
      } else if (preset === 'sin(x)') {
        currentFunc = (x) => Math.sin(x);
        functionLabel.textContent = 'y = sin(x)';
      } else if (preset === 'cos(x)') {
        currentFunc = (x) => Math.cos(x);
        functionLabel.textContent = 'y = cos(x)';
      }
    }
    drawPlot();
  }

  presetSelect.addEventListener('change', updateFunctionFromControls);
  if (customInput) customInput.addEventListener('input', updateFunctionFromControls);

  function drawPlot() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    // Retina / High-DPI canvas scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const xmin = parseFloat(xminInput.value) || -10;
    const xmax = parseFloat(xmaxInput.value) || 10;
    const ymin = parseFloat(yminInput.value) || -10;
    const ymax = parseFloat(ymaxInput.value) || 10;

    // Coordinate transforms
    const toScreenX = (x) => ((x - xmin) / (xmax - xmin)) * width;
    const toScreenY = (y) => height - ((y - ymin) / (ymax - ymin)) * height;
    const toWorldX = (px) => xmin + (px / width) * (xmax - xmin);
    const toWorldY = (py) => ymax - (py / height) * (ymax - ymin);

    // Color definitions
    const bgFill = isDark ? '#060a14' : '#f8fafc';
    const gridMajor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
    const gridMinor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
    const axisColor = isDark ? '#00f0ff' : '#0284c7';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const curveColor = isDark ? '#a855f7' : '#7c3aed';

    // Clear background
    ctx.fillStyle = bgFill;
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines & Ticks
    const xRange = xmax - xmin;
    const yRange = ymax - ymin;
    const calcStep = (range) => {
      const rough = range / 10;
      const mag = Math.pow(10, Math.floor(Math.log10(rough)));
      const norm = rough / mag;
      if (norm < 1.5) return mag;
      if (norm < 3.5) return 2 * mag;
      if (norm < 7.5) return 5 * mag;
      return 10 * mag;
    };

    const xStep = calcStep(xRange);
    const yStep = calcStep(yRange);

    // Vertical grid lines
    ctx.lineWidth = 1;
    ctx.font = '11px Cascadia Code, monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const firstX = Math.ceil(xmin / xStep) * xStep;
    for (let x = firstX; x <= xmax; x += xStep) {
      const px = toScreenX(x);
      ctx.strokeStyle = Math.abs(x) < 1e-6 ? axisColor : gridMajor;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      // Label (skip 0 to avoid collision with Y axis)
      if (Math.abs(x) > 1e-6) {
        const py = Math.min(Math.max(toScreenY(0) + 4, 10), height - 20);
        ctx.fillText(parseFloat(x.toFixed(3)), px, py);
      }
    }

    // Horizontal grid lines
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const firstY = Math.ceil(ymin / yStep) * yStep;
    for (let y = firstY; y <= ymax; y += yStep) {
      const py = toScreenY(y);
      ctx.strokeStyle = Math.abs(y) < 1e-6 ? axisColor : gridMajor;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      if (Math.abs(y) > 1e-6) {
        const px = Math.min(Math.max(toScreenX(0) - 6, 30), width - 10);
        ctx.fillText(parseFloat(y.toFixed(3)), px, py);
      }
    }

    // Draw Main Axes (X and Y with arrows)
    const originX = toScreenX(0);
    const originY = toScreenY(0);

    ctx.lineWidth = 2;
    ctx.strokeStyle = axisColor;

    // X axis
    if (originY >= 0 && originY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.stroke();
    }

    // Y axis
    if (originX >= 0 && originX <= width) {
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();
    }

    // Origin label (0,0)
    ctx.fillStyle = axisColor;
    ctx.textAlign = 'right';
    ctx.fillText('(0,0)', originX - 6, originY + 14);

    // Plot Function Curve
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = curveColor;
    ctx.beginPath();

    let started = false;
    const samples = width * 2;
    for (let i = 0; i <= samples; i++) {
      const px = (i / samples) * width;
      const x = toWorldX(px);
      const y = currentFunc(x);

      if (isNaN(y) || !isFinite(y)) {
        started = false;
        continue;
      }

      const py = toScreenY(y);
      // Filter out huge asymptote jumps (e.g. tan(x))
      if (py < -height || py > height * 2) {
        started = false;
        continue;
      }

      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Hover Tracking Dot and Crosshair
    if (mouseWorldPos) {
      const hX = mouseWorldPos.x;
      const hY = currentFunc(hX);
      if (!isNaN(hY) && isFinite(hY)) {
        const hpX = toScreenX(hX);
        const hpY = toScreenY(hY);

        if (hpX >= 0 && hpX <= width && hpY >= 0 && hpY <= height) {
          // Draw tracking dot
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.arc(hpX, hpY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Tooltip badge on canvas
          ctx.fillStyle = 'rgba(7, 11, 20, 0.85)';
          const text = `(${hX.toFixed(2)}, ${hY.toFixed(2)})`;
          const textWidth = ctx.measureText(text).width;
          ctx.fillRect(hpX + 10, hpY - 24, textWidth + 14, 22);
          ctx.fillStyle = '#00f0ff';
          ctx.textAlign = 'left';
          ctx.fillText(text, hpX + 17, hpY - 13);
        }
      }
    }
  }

  // Mouse hover event listener
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const xmin = parseFloat(xminInput.value) || -10;
    const xmax = parseFloat(xmaxInput.value) || 10;
    const ymin = parseFloat(yminInput.value) || -10;
    const ymax = parseFloat(ymaxInput.value) || 10;

    const x = xmin + (px / rect.width) * (xmax - xmin);
    const y = currentFunc(x);

    mouseWorldPos = { x, y };

    if (!isNaN(y) && isFinite(y)) {
      coordsDisplay.textContent = `Coordinates: x = ${x.toFixed(3)}, y = f(x) = ${y.toFixed(3)}`;
    } else {
      coordsDisplay.textContent = `Coordinates: x = ${x.toFixed(3)}, f(x) is undefined`;
    }

    drawPlot();
  });

  canvas.addEventListener('mouseleave', () => {
    mouseWorldPos = null;
    coordsDisplay.textContent = 'Hover over canvas to track coordinates';
    drawPlot();
  });

  btnDraw.addEventListener('click', drawPlot);

  btnReset.addEventListener('click', () => {
    presetSelect.value = 'x^2';
    xminInput.value = -10;
    xmaxInput.value = 10;
    yminInput.value = -10;
    ymaxInput.value = 10;
    updateFunctionFromControls();
    showToast('Reset graph plotter to defaults');
  });

  // Preset range shortcuts
  document.querySelectorAll('.range-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      xminInput.value = btn.getAttribute('data-xmin');
      xmaxInput.value = btn.getAttribute('data-xmax');
      yminInput.value = btn.getAttribute('data-ymin');
      ymaxInput.value = btn.getAttribute('data-ymax');
      drawPlot();
      showToast('Updated graph view range');
    });
  });

  // Download Canvas as PNG
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `MathSphere-${currentExprStr}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Exported graph as PNG image!');
    });
  }

  // Window resize re-render
  window.addEventListener('resize', drawPlot);

  // Expose global redraw hook for theme switcher
  window.mathSphereRedrawPlot = drawPlot;

  // Initial draw
  updateFunctionFromControls();
}

/* ==========================================================================
   MODULE 7: INTERACTIVE MATH QUIZ ENGINE
   ========================================================================== */

function initQuiz() {
  const questions = [
    {
      category: 'Arithmetic',
      question: 'Evaluate the expression: $18 - 3 \\times (4 + 2) \\div 9$',
      options: ['16', '14', '12', '10'],
      correct: 0,
      explanation: 'Follow order of operations (PEMDAS): Parentheses first ($4 + 2 = 6$). Then $3 \\times 6 = 18$. Next $18 \\div 9 = 2$. Finally $18 - 2 = 16$.'
    },
    {
      category: 'Number Systems',
      question: 'What is the binary representation of decimal number 42?',
      options: ['101010', '110010', '100101', '111000'],
      correct: 0,
      explanation: '$42 = 32 + 8 + 2 = (1 \\times 2^5) + (0 \\times 2^4) + (1 \\times 2^3) + (0 \\times 2^2) + (1 \\times 2^1) + (0 \\times 2^0) = 101010_2$.'
    },
    {
      category: 'Matrices',
      question: 'If Matrix $A$ has dimensions $3 \\times 2$ and Matrix $B$ has dimensions $2 \\times 4$, what are the dimensions of the product $AB$?',
      options: ['$2 \\times 2$', '$3 \\times 4$', '$3 \\times 2$', 'Undefined (cannot multiply)'],
      correct: 1,
      explanation: 'Matrix multiplication: If $A$ is of size $m \\times k$ and $B$ is of size $k \\times n$, then the product $AB$ has size $m \\times n$. Here ($3 \\times 2$) $\\times$ ($2 \\times 4$) results in a $3 \\times 4$ matrix.'
    },
    {
      category: 'Algebra',
      question: 'What is the discriminant ($\\Delta = b^2 - 4ac$) of the equation $2x^2 - 4x + 2 = 0$, and what does it tell us?',
      options: [
        '$\\Delta = 0$ (Exactly one repeated real root)',
        '$\\Delta = 16$ (Two distinct real roots)',
        '$\\Delta = -16$ (Two complex conjugate roots)',
        '$\\Delta = 4$ (Two irrational roots)'
      ],
      correct: 0,
      explanation: '$\\Delta = (-4)^2 - 4(2)(2) = 16 - 16 = 0$. When the discriminant is 0, the parabola touches the x-axis at exactly one point.'
    },
    {
      category: 'Trigonometry',
      question: 'What is the exact value of $\\sin(30^\\circ)$ in degrees, or $\\sin(\\pi/6)$ in radians?',
      options: ['1', '0.5', '$\\frac{\\sqrt{3}}{2}$', '$\\frac{\\sqrt{2}}{2}$'],
      correct: 1,
      explanation: 'On the unit circle, an angle of $30^\\circ$ ($\\pi/6$ radians) has a vertical y-coordinate of exactly $0.5$ ($1/2$).'
    },
    {
      category: 'Number Systems',
      question: 'What is the decimal equivalent of the hexadecimal number 0x2F?',
      options: ['45', '47', '32', '59'],
      correct: 1,
      explanation: 'Hexadecimal positional expansion: $(2 \\times 16^1) + (15 \\times 16^0) = 32 + 15 = 47$.'
    },
    {
      category: 'Matrices',
      question: 'What is the determinant of the $2 \\times 2$ matrix: $\\begin{pmatrix} 3 & 2 \\\\ 1 & 4 \\end{pmatrix}$?',
      options: ['10', '14', '7', '-2'],
      correct: 0,
      explanation: 'For a $2 \\times 2$ matrix $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, $\\det(A) = ad - bc = (3)(4) - (2)(1) = 12 - 2 = 10$.'
    },
    {
      category: 'Algebra',
      question: 'Solve for $x$: $5x - 7 = 3x + 9$',
      options: ['$x = 8$', '$x = 1$', '$x = 16$', '$x = 4$'],
      correct: 0,
      explanation: 'Subtract $3x$ from both sides: $2x - 7 = 9$. Add 7: $2x = 16$. Divide by 2: $x = 8$.'
    },
    {
      category: 'Arithmetic',
      question: 'What is $2^3 + 3^2 - \\sqrt{64}$?',
      options: ['9', '17', '8', '11'],
      correct: 0,
      explanation: '$2^3 = 8$, $3^2 = 9$, and $\\sqrt{64} = 8$. Therefore, $8 + 9 - 8 = 9$.'
    },
    {
      category: 'Matrices',
      question: 'A square matrix $A$ is called "singular" if and only if:',
      options: [
        'Its determinant is equal to 0 ($\\det(A) = 0$)',
        'All its elements are zero',
        'It has an inverse matrix',
        'Its transpose equals itself'
      ],
      correct: 0,
      explanation: 'By definition in linear algebra, a matrix is singular when $\\det(A) = 0$. A singular matrix cannot be inverted because division by determinant 0 is undefined.'
    }
  ];

  let currentIdx = 0;
  let score = 0;
  let answered = false;

  const qCounter = document.getElementById('quiz-question-counter');
  const qCategory = document.getElementById('quiz-category-tag');
  const qScoreTracker = document.getElementById('quiz-score-tracker');
  const qProgressBar = document.getElementById('quiz-progress-fill');
  const qText = document.getElementById('quiz-question-text');
  const qOptionsList = document.getElementById('quiz-options-list');
  const qFeedbackBox = document.getElementById('quiz-explanation-box');
  const qNextBtn = document.getElementById('quiz-next-btn');

  const qQuestionCard = document.getElementById('quiz-question-box');
  const qResultsCard = document.getElementById('quiz-results-box');
  const qFinalPercentage = document.getElementById('quiz-final-percentage');
  const qFinalFraction = document.getElementById('quiz-final-fraction');
  const qFinalMessage = document.getElementById('quiz-final-message');
  const qBreakdownList = document.getElementById('quiz-breakdown-container');
  const qRestartBtn = document.getElementById('quiz-restart-btn');

  function renderQuestion() {
    answered = false;
    const q = questions[currentIdx];

    qCounter.textContent = `Question ${currentIdx + 1} of ${questions.length}`;
    qCategory.textContent = q.category;
    qScoreTracker.textContent = `Score: ${score} / ${currentIdx}`;

    const progressPct = ((currentIdx) / questions.length) * 100;
    qProgressBar.style.width = `${progressPct}%`;

    qText.textContent = q.question;
    qFeedbackBox.style.display = 'none';
    qNextBtn.style.display = 'none';

    qOptionsList.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerHTML = `<span class="opt-letter">${letters[idx]}</span> <span>${opt}</span>`;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');

      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        handleAnswer(idx, q);
      });

      qOptionsList.appendChild(btn);
    });

    renderMath(qQuestionCard);
  }

  function handleAnswer(selectedIdx, q) {
    const optionBtns = qOptionsList.querySelectorAll('.quiz-opt-btn');
    const isCorrect = (selectedIdx === q.correct);

    if (isCorrect) {
      score++;
      showToast('Correct! Well done!');
    } else {
      showToast('Incorrect. Check the explanation below.');
    }

    optionBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct) {
        btn.classList.add('opt-correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('opt-wrong');
      }
    });

    qScoreTracker.textContent = `Score: ${score} / ${currentIdx + 1}`;
    qFeedbackBox.innerHTML = `
      <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect.'}</strong><br>
      ${q.explanation}
    `;
    qFeedbackBox.style.display = 'block';
    renderMath(qFeedbackBox);

    if (currentIdx < questions.length - 1) {
      qNextBtn.textContent = 'Next Question →';
      qNextBtn.style.display = 'inline-block';
    } else {
      qNextBtn.textContent = 'See Final Results 🏆';
      qNextBtn.style.display = 'inline-block';
    }
  }

  qNextBtn.addEventListener('click', () => {
    if (currentIdx < questions.length - 1) {
      currentIdx++;
      renderQuestion();
    } else {
      showResults();
    }
  });

  function showResults() {
    qProgressBar.style.width = '100%';
    qQuestionCard.style.display = 'none';
    qResultsCard.style.display = 'block';

    const percentage = Math.round((score / questions.length) * 100);
    qFinalPercentage.textContent = `${percentage}%`;
    qFinalFraction.textContent = `${score} of ${questions.length} Correct`;

    let msg = '';
    if (percentage === 100) {
      msg = '🌟 Perfect Score! You are a true Mathematical Mastermind!';
    } else if (percentage >= 80) {
      msg = '🚀 Outstanding Performance! You have a commanding grasp of mathematics.';
    } else if (percentage >= 60) {
      msg = '👏 Great Job! Solid mathematical foundation with just a few concepts to review.';
    } else {
      msg = '💡 Good Effort! Review the Learning Hub tutorials to sharpen your skills and try again.';
    }
    qFinalMessage.textContent = msg;
  }

  qRestartBtn.addEventListener('click', () => {
    currentIdx = 0;
    score = 0;
    qResultsCard.style.display = 'none';
    qQuestionCard.style.display = 'block';
    renderQuestion();
    showToast('Quiz restarted');
  });

  // Start quiz
  renderQuestion();
}

/* ==========================================================================
   MODULE 8: LEARNING HUB DEEP-LINKING UTILITIES
   ========================================================================== */

function initLearningHubLinks() {
  // Smooth scroll links with hash offsets
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
