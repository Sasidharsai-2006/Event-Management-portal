const mongoose = require('mongoose');
const User = require('../models/User');
const Club = require('../models/Club');
const Event = require('../models/Event');
const bcrypt = require('bcryptjs');

// Sample data for clubs
const clubsData = [
  {
    name: 'MLSC (Machine Learning Student Community)',
    description: 'A community of students passionate about machine learning, AI, and data science. We organize workshops, hackathons, and research projects.',
    category: 'technical',
    type: 'student_led',
    maxMembers: 100,
    membershipFee: 0,
    contactInfo: {
      email: 'mlsc@campusconnect.edu',
      phone: '+1 (555) 123-4567'
    },
    meetingSchedule: {
      day: 'Friday',
      time: '18:00',
      venue: 'Computer Lab 101',
      frequency: 'weekly'
    },
    tags: ['machine learning', 'AI', 'data science', 'python', 'tensorflow'],
    rules: [
      'Attend at least 2 meetings per month',
      'Participate in at least one project per semester',
      'Share knowledge and help fellow members'
    ],
    requirements: [
      'Basic programming knowledge',
      'Interest in machine learning',
      'Commitment to learning and growing'
    ]
  },
  {
    name: 'GFG (GeeksforGeeks) Student Chapter',
    description: 'Official GeeksforGeeks student chapter focused on competitive programming, data structures, and algorithms. We conduct coding contests and interview preparation sessions.',
    category: 'technical',
    type: 'official',
    maxMembers: 150,
    membershipFee: 0,
    contactInfo: {
      email: 'gfg@campusconnect.edu',
      phone: '+1 (555) 123-4568'
    },
    meetingSchedule: {
      day: 'Saturday',
      time: '10:00',
      venue: 'Programming Lab 201',
      frequency: 'weekly'
    },
    tags: ['competitive programming', 'algorithms', 'data structures', 'interview prep', 'coding'],
    rules: [
      'Participate in weekly coding contests',
      'Complete assigned practice problems',
      'Help peers with coding challenges'
    ],
    requirements: [
      'Basic programming knowledge in any language',
      'Commitment to regular practice',
      'Willingness to help others learn'
    ]
  },
  {
    name: 'GDG (Google Developer Group)',
    description: 'Google Developer Group focused on Google technologies, cloud computing, and developer tools. We organize tech talks, workshops, and Google Cloud events.',
    category: 'technical',
    type: 'official',
    maxMembers: 80,
    membershipFee: 0,
    contactInfo: {
      email: 'gdg@campusconnect.edu',
      phone: '+1 (555) 123-4569'
    },
    meetingSchedule: {
      day: 'Wednesday',
      time: '19:00',
      venue: 'Google Cloud Lab',
      frequency: 'bi-weekly'
    },
    tags: ['google cloud', 'android development', 'web development', 'firebase', 'flutter'],
    rules: [
      'Attend monthly tech talks',
      'Participate in Google Cloud challenges',
      'Share knowledge about Google technologies'
    ],
    requirements: [
      'Interest in Google technologies',
      'Basic programming knowledge',
      'Active participation in events'
    ]
  },
  {
    name: 'BlackBox - Cybersecurity Club',
    description: 'Cybersecurity and ethical hacking club focused on information security, penetration testing, and digital forensics. We conduct CTF competitions and security workshops.',
    category: 'technical',
    type: 'student_led',
    maxMembers: 60,
    membershipFee: 0,
    contactInfo: {
      email: 'blackbox@campusconnect.edu',
      phone: '+1 (555) 123-4570'
    },
    meetingSchedule: {
      day: 'Thursday',
      time: '17:00',
      venue: 'Security Lab 301',
      frequency: 'weekly'
    },
    tags: ['cybersecurity', 'ethical hacking', 'penetration testing', 'CTF', 'digital forensics'],
    rules: [
      'Follow ethical guidelines strictly',
      'Participate in CTF competitions',
      'Keep club activities confidential'
    ],
    requirements: [
      'Strong ethical values',
      'Basic networking knowledge',
      'Commitment to cybersecurity learning'
    ]
  }
];

// Sample data for events
const eventsData = [
  {
    title: 'AI Tools Workshop 2024',
    description: 'Learn about the latest AI tools including ChatGPT, Claude, Midjourney, and more. Hands-on workshop with practical examples and real-world applications.',
    eventType: 'workshop',
    category: 'individual',
    startDate: new Date('2024-03-15T10:00:00Z'),
    endDate: new Date('2024-03-15T16:00:00Z'),
    registrationDeadline: new Date('2024-03-10T23:59:59Z'),
    venue: 'Main Auditorium',
    maxParticipants: 200,
    registrationFee: 0,
    rules: [
      'Bring your laptop',
      'Install required software beforehand',
      'Active participation required'
    ],
    requirements: [
      'Basic computer knowledge',
      'Laptop with internet connection',
      'Interest in AI and technology'
    ],
    prizes: [
      { position: 1, title: 'Best Project', description: 'Certificate + $100 Gift Card', value: '$100' },
      { position: 2, title: 'Runner Up', description: 'Certificate + $50 Gift Card', value: '$50' },
      { position: 3, title: 'Third Place', description: 'Certificate + $25 Gift Card', value: '$25' }
    ],
    tags: ['AI', 'ChatGPT', 'Machine Learning', 'Workshop', 'Technology']
  },
  {
    title: 'Prompt Engineering Masterclass',
    description: 'Master the art of prompt engineering for AI models. Learn advanced techniques, best practices, and optimization strategies for better AI interactions.',
    eventType: 'workshop',
    category: 'individual',
    startDate: new Date('2024-03-22T09:00:00Z'),
    endDate: new Date('2024-03-22T17:00:00Z'),
    registrationDeadline: new Date('2024-03-17T23:59:59Z'),
    venue: 'Computer Lab 101',
    maxParticipants: 50,
    registrationFee: 0,
    rules: [
      'Bring your laptop',
      'Create OpenAI account beforehand',
      'Complete pre-workshop assignments'
    ],
    requirements: [
      'Basic understanding of AI',
      'Laptop with internet connection',
      'OpenAI API access (free tier acceptable)'
    ],
    prizes: [
      { position: 1, title: 'Prompt Master', description: 'Certificate + Premium AI Tools Access', value: 'Premium Access' },
      { position: 2, title: 'Creative Prompter', description: 'Certificate + AI Tools Bundle', value: 'Tools Bundle' },
      { position: 3, title: 'Rising Star', description: 'Certificate + Learning Resources', value: 'Resources' }
    ],
    tags: ['Prompt Engineering', 'AI', 'ChatGPT', 'Workshop', 'Advanced']
  },
  {
    title: 'Hackathon: Build with AI',
    description: '48-hour hackathon focused on building innovative solutions using AI. Teams of 2-4 members will create projects using various AI tools and APIs.',
    eventType: 'competition',
    category: 'team',
    startDate: new Date('2024-04-05T18:00:00Z'),
    endDate: new Date('2024-04-07T18:00:00Z'),
    registrationDeadline: new Date('2024-03-30T23:59:59Z'),
    venue: 'Innovation Lab',
    maxParticipants: 100,
    registrationFee: 0,
    rules: [
      'Teams of 2-4 members',
      'No pre-built projects allowed',
      'Present your solution in 5 minutes'
    ],
    requirements: [
      'Programming experience',
      'Team formation required',
      'Laptop and development tools'
    ],
    prizes: [
      { position: 1, title: 'Grand Prize', description: 'Certificate + $1000 Cash Prize', value: '$1000' },
      { position: 2, title: 'Second Place', description: 'Certificate + $500 Cash Prize', value: '$500' },
      { position: 3, title: 'Third Place', description: 'Certificate + $250 Cash Prize', value: '$250' }
    ],
    tags: ['Hackathon', 'AI', 'Competition', 'Innovation', 'Team']
  },
  {
    title: 'Data Science Bootcamp',
    description: 'Intensive 3-day bootcamp covering data analysis, visualization, and machine learning. Perfect for beginners and intermediate learners.',
    eventType: 'workshop',
    category: 'individual',
    startDate: new Date('2024-04-12T09:00:00Z'),
    endDate: new Date('2024-04-14T17:00:00Z'),
    registrationDeadline: new Date('2024-04-05T23:59:59Z'),
    venue: 'Data Science Lab',
    maxParticipants: 80,
    registrationFee: 0,
    rules: [
      'Attend all 3 days',
      'Complete daily assignments',
      'Bring your laptop'
    ],
    requirements: [
      'Basic Python knowledge',
      'Laptop with Python installed',
      'Commitment to full 3-day program'
    ],
    prizes: [
      { position: 1, title: 'Data Science Champion', description: 'Certificate + Job Placement Assistance', value: 'Job Assistance' },
      { position: 2, title: 'Analytics Expert', description: 'Certificate + Advanced Course Access', value: 'Course Access' },
      { position: 3, title: 'Data Enthusiast', description: 'Certificate + Learning Resources', value: 'Resources' }
    ],
    tags: ['Data Science', 'Python', 'Machine Learning', 'Bootcamp', 'Analytics']
  },
  {
    title: 'Cybersecurity CTF Competition',
    description: 'Capture The Flag competition testing your cybersecurity skills. Challenges include cryptography, web security, reverse engineering, and forensics.',
    eventType: 'competition',
    category: 'individual',
    startDate: new Date('2024-04-20T10:00:00Z'),
    endDate: new Date('2024-04-20T18:00:00Z'),
    registrationDeadline: new Date('2024-04-15T23:59:59Z'),
    venue: 'Security Lab 301',
    maxParticipants: 60,
    registrationFee: 0,
    rules: [
      'Individual participation only',
      'No external help allowed',
      'Follow ethical guidelines'
    ],
    requirements: [
      'Basic cybersecurity knowledge',
      'Laptop with required tools',
      'Strong ethical values'
    ],
    prizes: [
      { position: 1, title: 'Security Master', description: 'Certificate + $500 Cash Prize', value: '$500' },
      { position: 2, title: 'Cyber Warrior', description: 'Certificate + $300 Cash Prize', value: '$300' },
      { position: 3, title: 'Digital Guardian', description: 'Certificate + $200 Cash Prize', value: '$200' }
    ],
    tags: ['Cybersecurity', 'CTF', 'Competition', 'Ethical Hacking', 'Security']
  }
];

// Sample admin user
const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@campusconnect.com',
  password: 'admin123',
  role: 'admin',
  isActive: true,
  isVerified: true,
  department: 'Administration',
  year: 'Faculty'
};

// Sample regular users
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'student@campusconnect.com',
    password: 'student123',
    role: 'student',
    studentId: 'CS2024001',
    department: 'Computer Science',
    year: '3rd',
    phone: '+1 (555) 123-4567'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'clubrep@campusconnect.com',
    password: 'clubrep123',
    role: 'club_rep',
    studentId: 'CS2024002',
    department: 'Computer Science',
    year: '4th',
    phone: '+1 (555) 123-4568'
  },
  {
    firstName: 'Sasidhar',
    lastName: 'Sai',
    email: 'sasidharsai26@gmail.com',
    password: 'Sasidhar_20',
    role: 'student',
    studentId: 'CS2024003',
    department: 'Computer Science',
    year: '3rd',
    phone: '+1 (555) 123-4569'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash(adminUser.password, 10);
    const admin = await User.create({
      ...adminUser,
      password: hashedAdminPassword
    });
    console.log('👤 Created admin user');

    // Create sample users
    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      users.push(user);
    }
    console.log('👥 Created sample users');

    // Create clubs
    const clubs = [];
    for (let i = 0; i < clubsData.length; i++) {
      const clubData = clubsData[i];
      const president = users[i % users.length]; // Assign president from users
      
      const club = await Club.create({
        ...clubData,
        president: president._id,
        status: 'approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
        members: [{
          user: president._id,
          role: 'president',
          status: 'approved',
          joinedAt: new Date()
        }],
        currentMembers: 1
      });
      clubs.push(club);
    }
    console.log('🏛️ Created clubs');

    // Create events
    const events = [];
    for (let i = 0; i < eventsData.length; i++) {
      const eventData = eventsData[i];
      const organizer = users[i % users.length]; // Assign organizer from users
      const club = clubs[i % clubs.length]; // Assign club from clubs
      
      const event = await Event.create({
        ...eventData,
        organizer: organizer._id,
        club: club._id,
        status: 'approved',
        approvedBy: admin._id,
        approvedAt: new Date(),
        publishedAt: new Date()
      });
      events.push(event);
    }
    console.log('📅 Created events');

    // Update clubs with events
    for (let i = 0; i < clubs.length; i++) {
      const club = clubs[i];
      const clubEvents = events.filter(event => event.club.toString() === club._id.toString());
      club.events = clubEvents.map(event => event._id);
      club.totalEvents = clubEvents.length;
      await club.save();
    }

    // Update users with club memberships
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userClubs = clubs.slice(0, 2); // Each user joins first 2 clubs
      
      for (const club of userClubs) {
        if (club.president.toString() !== user._id.toString()) {
          user.clubs.push({
            club: club._id,
            role: 'member',
            status: 'approved',
            joinedAt: new Date()
          });
        }
      }
      await user.save();
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👤 Users: ${await User.countDocuments()}`);
    console.log(`🏛️ Clubs: ${await Club.countDocuments()}`);
    console.log(`📅 Events: ${await Event.countDocuments()}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@campusconnect.com / admin123');
    console.log('Student: student@campusconnect.com / student123');
    console.log('Club Rep: clubrep@campusconnect.com / clubrep123');
    console.log('Your Account: sasidharsai26@gmail.com / Sasidhar_20');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
