# Do You Know? - DevDuel Hackathon Submission

**Dev Duel - ELAN NVision 2026, IIT Hyderabad**  
**Category:** EduTech

---

## Project Overview

![banner](./assets/web%20gfx/pc.jpeg)<br>

**Do You Know?** is an interactive educational quiz platform designed to make learning engaging and fun. The application delivers a gamified trivia experience with dynamic difficulty levels, instant feedback, and XP-based progression tracking - perfect for students who want to study while having fun.

Built with vanilla HTML5, CSS3, and JavaScript, this platform emphasizes **responsive design**, **immersive user experience**, and **real-time learning analytics**. Students can explore diverse topics across multiple difficulty levels and track their learning progress through an XP system.

---

## EduTech Impact
![Happy Learning](./assets/web%20gfx/pusheen.jpeg)<br>
This application addresses key EduTech challenges:

- **Engagement:** Gamified learning with XP rewards keeps students motivated
- **Accessibility:** Works seamlessly across all devices (mobile, tablet, desktop)
- **Variety:** Integrates with OpenTDB API for 1000+ questions across 4 main categories
- **Scalability:** Lightweight, no backend required - can be deployed anywhere
- **Progress Tracking:** Persistent XP storage via localStorage for progress monitoring

---

## Key Features
![Learning Experience](./assets/web%20gfx/emotion.jpeg)<br>

### 1. **Gamified Learning Experience**
   - 10-question quizzes per session
   - 4 category selection (Math, Science, Computer, Open)
   - Difficulty levels (Easy, Medium, Hard)
   - "Open" category locked to Easy difficulty for accessibility

   

### 2. **Immersive Interface**
   - Professional splash screen with intro video
   - Background music for enhanced engagement
   - Smooth page transitions and animations
   - Color-coded feedback (green for correct, red for incorrect answers)

   

### 3. **Real-Time Feedback**
   - Instant visual feedback on answer selection
   - 900ms delay before advancing to next question (giving users time to reflect)
   - Locked answers after submission (prevents frustration)
   - Double-click validation on final question

### 4. **Progress & Analytics**
   - Score calculation based on difficulty (Easy=1pt, Medium=2pts, Hard=4pts)
   - Lifetime XP tracking via localStorage
   - Session-based score display
   - Results screen with comprehensive performance metrics

### 5. **Responsive Design**
   - Desktop: Split-layout with question on left, answers on right
   - Mobile: Stacked layout for optimal viewing
   - Background images for visual appeal (no text overlays)
   - Seamless transitions between screen sizes

   

### 6. **Accessibility**
   - Semantic HTML for screen readers
   - ARIA attributes for disabled states
   - Clear visual hierarchy
   - High contrast ratios for readability

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure and DOM elements |
| **CSS3** | Responsive layout (Grid, Flexbox), animations, overlays |
| **JavaScript (Vanilla)** | Quiz logic, API integration, state management |
| **OpenTDB API** | Curated trivia questions (20+ categories, multiple difficulty levels) |
| **localStorage API** | Persistent user progress tracking |

**No external frameworks or dependencies** - pure vanilla implementation for maximum portability.

---

## How to Set Up & Run
![Mobile & Desktop](./assets/web%20gfx/mobile.jpeg) <br>

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for API calls to OpenTDB)
- No installation or build tools required

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Limitless-Demon-Venerable/Do-you-know--DevDuel.git
   cd Do-you-know--DevDuel
   ```

2. **Navigate to project directory:**
   ```bash
   cd "Do you know -DevDuel"
   ```

3. **Launch the application:**
   - Open `index.html` directly in your web browser, or
   - Use a local server for development:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Python 2
     python -m SimpleHTTPServer 8000
     
     # Using Node.js (if installed)
     npx http-server
     ```
   - Then navigate to `http://localhost:8000`

### File Structure
```
Do you know -DevDuel/
├── index.html          # Main quiz structure
├── readme.md           # This file
├── helper/
│   ├── index.js        # Quiz logic and API integration
│   └── index.css       # Responsive styling
└── assets/
    └── web gfx/        # Background images for immersion
```

---

## 🎮 How to Use

1. **Landing Page:** View the splash screen intro (auto-hides after 5 seconds)
2. **Category Selection:** Choose a trivia category (Math, Science, Computing, or Open Topics)
3. **Difficulty Selection:** Pick your challenge level (Easy, Medium, Hard)
   - *Note: "Open Topics" category is locked to Easy for accessibility*
4. **Watch the Video:** Introductory video plays, building anticipation
5. **Answer Questions:** Select answers for 10 trivia questions in sequence
   - Correct answers highlight in green
   - Incorrect selections show in red
   - Answers lock after submission (no changing your mind!)
6. **View Results:** See your session score and total lifetime XP
7. **Study Again:** Click "Study Again" to restart with a new set of questions



---

## 📊 Scoring System
![Focus & Learning](./assets/web%20gfx/focus.jpeg)<br>

| Difficulty | Points |
|------------|--------|
| Easy | 1 point |
| Medium | 2 points |
| Hard | 4 points |

**Example:** A perfect score on Hard difficulty = 10 × 4 = **40 XP**

Your lifetime XP persists across sessions and is stored in your browser's local storage.

---

## Architecture & Code Design

### Key JavaScript Functions

- **`getData(URL)`** - Fetches questions from OpenTDB API
- **`des(res)`** - Destructures API response into organized arrays
- **`populateUI()`** - Renders questions and answer options
- **`enableGameLogic()`** - Sets up event listeners for quiz interaction
- **`changePage(newIndex)`** - Smooth navigation between question pages
- **`startQuiz()`** - Initializes the quiz after video completes
- **`showResults()`** - Displays final score and XP

### CSS Approach

- **Mobile-first design** with breakpoints at 900px
- **CSS Grid** for desktop split-layout
- **Flexbox** for responsive component alignment
- **Background images** with soft overlays for readability
- **Smooth transitions** for visual feedback

### State Management

All state is managed through:
- **DOM attributes** (`data-processed`, `data-isCorrect`)
- **CSS classes** (`.active`, `.selected`, `.locked`)
- **JavaScript variables** for quiz session data
- **localStorage** for persistent XP tracking


---

## API Integration

This project uses the **Open Trivia Database API** (https://opentdb.com/):

```javascript
// Example API request
https://opentdb.com/api.php?amount=10&category=19&difficulty=easy
```

**Parameters:**
- `amount=10` - Always fetch 10 questions per quiz
- `category` - Optional (19=Math, 17=Science, 18=Computers)
- `difficulty` - Optional (easy, medium, hard)

**No API key required** - perfect for hackathons!

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Edge | Full support |
| Firefox | Full support |
| Safari | Full support |
| Mobile Safari | Full support |
| Chrome Mobile | Full support |

---

## Hackathon Submission Checklist

- Source code in GitHub repository
- README.md with setup instructions
- 3-5 minute project explanation video
- Original code (created during hackathon)
- All features fully functional
- Responsive design (mobile + desktop)
- Code with humanized, maintainable comments

---

## Team

**Project:** Do You Know? - DevDuel Hackathon  
**Category:** EduTech  
**Event:** Dev Duel 2026, ELAN NVision, IIT Hyderabad

---

## License

This project is submitted for the Dev Duel hackathon 2026. All code is original and created during the hackathon event.

---

## Contributing

This is a hackathon submission. Post-competition contributions and enhancements are welcome!

---

## Contact & Support

For questions about this project, please reach out via GitHub issues or the Dev Duel Discord server.

**Discord:** [Dev Duel Community](https://discord.gg/SwmEp2A4)<br>

---

**Happy Learning!**

![Immersive Interface](./assets/web%20gfx/laptop.jpeg)<br>
