 document.addEventListener('DOMContentLoaded', () => {
            // --- DOM Elements ---
            const dashboardView = document.getElementById('dashboard-view');
            const chatView = document.getElementById('chat-view');
            const serviceCards = document.querySelectorAll('.service-card');
            const backButton = document.getElementById('back-to-dashboard');
            const chatTitle = document.getElementById('chat-title');
            const chatMessages = document.getElementById('chat-messages');
            const chatInput = document.getElementById('chat-input');
            const sendBtn = document.getElementById('send-btn');

            let currentService = null;

            // --- Chatbot Data & Logic ---
            const chatbotData = {
                'lead-gen': {
                    title: 'Lead Generation Bot',
                    welcome: "Hello! I'm the Lead Generation Agent. I can help you find and qualify leads. What industry are you targeting?",
                    responses: {
                        'default': "That's interesting. My system can scan over 10 million companies to find the perfect match for your criteria. Would you like to know more about pricing?",
                        'car': "Excellent choice! For automotive, I can identify dealerships with low inventory or individuals whose leases are expiring soon. This creates a highly qualified lead list.",
                        'tech': "Tech is a great sector. I can analyze company tech stacks to find businesses using competitor software, making them prime targets for outreach.",
                        'pricing': "Our plans start at $499/month for 500 qualified leads. We also offer enterprise solutions. Can I prepare a quote for you?"
                    }
                },
                'onboarding': {
                    title: 'Onboarding Assistant',
                    welcome: "Welcome! I'm here to streamline customer onboarding. I can handle KYC, document verification, and account setup. To start, could you tell me if this is for a personal or business account?",
                    responses: {
                        'default': "Understood. The next step would be identity verification. I can process a driver's license or passport in under 30 seconds using OCR and facial recognition. Would you like a demo?",
                        'personal': "Great. For personal accounts, I'll need a government-issued ID and proof of address. The entire process is automated and usually takes less than 2 minutes.",
                        'business': "For business accounts, I'll need the company registration documents and IDs for the primary directors. I can automatically cross-reference this with public records to ensure compliance.",
                    }
                },
                'claims': {
                    title: 'Claims Processing Agent',
                    welcome: "Hello, I am the AI Claims Processor. I can help you file and validate insurance claims quickly. Please provide the policy number to begin.",
                    responses: {
                        'default': "Thank you. I've located the policy. I can automatically extract information from invoices, photos, and reports to pre-fill the claim form, reducing errors by 95%. What type of claim is this (e.g., auto, home, health)?",
                         'auto': "For auto claims, please upload photos of the damage and the police report if available. My vision AI will assess the damage and estimate repair costs instantly.",
                         'health': "For health claims, please provide the medical provider's name and the date of service. I will securely retrieve the necessary documents from the provider's portal."
                    }
                },
                'scheduling': {
                    title: 'AI Appointment Scheduler',
                    welcome: "Hi! I'm your AI Scheduler. I can book, reschedule, or cancel appointments for you. Which department or person are you trying to book with?",
                    responses: {
                        'default': "Okay. I'm checking their calendar for openings. I can also coordinate with multiple people to find a time that works for everyone. What's the best day for you?",
                        'sales': "The sales team is available. I see openings tomorrow at 10 AM and 2 PM. I can also check for other times. Which would you prefer?",
                        'support': "Our support team is ready to help. To connect you with the right expert, could you briefly describe the issue?",
                    }
                },
                'support': {
                    title: 'E-commerce Support Bot',
                    welcome: "Welcome to support! I can help with returns, refunds, and order status. How can I assist you today?",
                    responses: {
                        'default': "I can certainly help with that. Could you please provide your order number?",
                        'return': "I've initiated the return process for you. A shipping label has been sent to your email. You can track the status of your return right here in this chat.",
                        'refund': "Once we receive your returned item, the refund will be processed within 3-5 business days. I will notify you as soon as it's complete.",
                        'status': "I see your order #12345 is currently out for delivery and should arrive today by 8 PM. Would you like to see the live tracking map?"
                    }
                }
            };

            // --- Functions ---

            // Function to add a message to the chat window
            function addMessage(sender, text) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('mb-4', 'fade-in');

                if (sender === 'bot') {
                    messageDiv.innerHTML = `
                        <div class="flex items-end gap-2">
                            <div class="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500 flex-shrink-0 text-white text-sm font-bold">AI</div>
                            <div class="bg-gray-700 p-3 rounded-lg rounded-bl-none max-w-md">
                                <p class="text-sm">${text}</p>
                            </div>
                        </div>
                    `;
                } else { // user
                    messageDiv.innerHTML = `
                        <div class="flex items-end justify-end gap-2">
                            <div class="bg-emerald-600 p-3 rounded-lg rounded-br-none max-w-md">
                                <p class="text-sm text-white">${text}</p>
                            </div>
                        </div>
                    `;
                }
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
            }

            // Function to get a bot response
            function getBotResponse(service, userInput) {
                const lowerInput = userInput.toLowerCase();
                const serviceResponses = chatbotData[service].responses;
                
                // Check for specific keywords
                for (const key in serviceResponses) {
                    if (lowerInput.includes(key)) {
                        return serviceResponses[key];
                    }
                }
                // Return default if no keyword matches
                return serviceResponses.default;
            }

            // Function to simulate bot typing and reply
            function handleUserMessage() {
                const userInput = chatInput.value.trim();
                if (userInput === '') return;

                addMessage('user', userInput);
                chatInput.value = '';
                sendBtn.disabled = true;

                // Simulate bot typing
                setTimeout(() => {
                    const typingIndicator = document.createElement('div');
                    typingIndicator.id = 'typing-indicator';
                    typingIndicator.innerHTML = `
                        <div class="flex items-end gap-2">
                            <div class="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500 flex-shrink-0 text-white text-sm font-bold">AI</div>
                            <div class="bg-gray-700 p-3 rounded-lg rounded-bl-none">
                                <div class="flex items-center gap-1">
                                    <span class="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s;"></span>
                                    <span class="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></span>
                                    <span class="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></span>
                                </div>
                            </div>
                        </div>
                    `;
                    chatMessages.appendChild(typingIndicator);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 500);

                // Get and display bot response
                setTimeout(() => {
                    document.getElementById('typing-indicator')?.remove();
                    const botResponse = getBotResponse(currentService, userInput);
                    addMessage('bot', botResponse);
                    sendBtn.disabled = false;
                }, 1500 + Math.random() * 500); // Random delay for realism
            }

            // Function to switch to chat view
            function showChat(service) {
                currentService = service;
                const data = chatbotData[service];

                // Animate out dashboard
                dashboardView.classList.add('fade-out');
                setTimeout(() => {
                    dashboardView.classList.add('hidden');
                    dashboardView.classList.remove('fade-out');
                    
                    // Setup and animate in chat
                    chatTitle.textContent = data.title;
                    chatMessages.innerHTML = ''; // Clear previous messages
                    addMessage('bot', data.welcome);
                    chatView.classList.remove('hidden');
                    chatView.classList.add('fade-in');
                }, 500);
            }

            // Function to switch back to dashboard view
            function showDashboard() {
                currentService = null;
                
                // Animate out chat
                chatView.classList.remove('fade-in');
                chatView.classList.add('fade-out');
                setTimeout(() => {
                    chatView.classList.add('hidden');
                    chatView.classList.remove('fade-out');

                    // Animate in dashboard
                    dashboardView.classList.remove('hidden');
                    dashboardView.classList.add('fade-in');
                }, 500);
            }


            // --- Event Listeners ---
            serviceCards.forEach(card => {
                card.addEventListener('click', () => {
                    const service = card.dataset.service;
                    if (service) {
                        showChat(service);
                    }
                });
            });

            backButton.addEventListener('click', showDashboard);

            sendBtn.addEventListener('click', handleUserMessage);

            chatInput.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    handleUserMessage();
                }
            });
        });