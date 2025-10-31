# Solve Exercises Feature - Setup Guide

## Overview

The Solve Exercises feature is a comprehensive AI-powered system that allows users to:
- Upload documents or capture photos of exercises
- Extract text using OCR (Optical Character Recognition)
- Analyze problems using AI
- Generate step-by-step solutions
- Ask follow-up questions for clarification

## Installation Instructions

### 1. Install Dependencies

The feature requires the following additional dependencies:

```bash
npm install tesseract.js
```

Or if using yarn:

```bash
yarn add tesseract.js
```

### 2. Database Migration

Run the database migration to add the exercise-related tables:

```bash
npx prisma migrate dev --name add-exercise-models
```

### 3. Update Environment Variables

Make sure your `.env` file contains all required variables from `.env.example`:

```bash
# Copy example file
cp .env.example .env

# Update with your actual values
# Make sure these are set:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_api_key
```

### 4. Start Development Server

```bash
npm run dev
```

## Features

### Core Functionality

1. **File Upload Support**
   - PDF documents
   - Images (JPG, PNG)
   - Word documents (DOCX)
   - Multi-file upload

2. **Camera Capture**
   - Real-time camera access
   - Photo capture with preview
   - Retake functionality
   - Front/back camera switching

3. **OCR Processing**
   - Text extraction from images
   - Handwriting recognition
   - PDF text extraction
   - Confidence scoring

4. **AI Analysis**
   - Problem type identification
   - Difficulty assessment
   - Subject classification
   - Keyword extraction

5. **Solution Generation**
   - Step-by-step explanations
   - Multiple solution methods
   - Confidence scoring
   - Processing time tracking

6. **Interactive Features**
   - Follow-up questions
   - Alternative solutions
   - Solution regeneration
   - User feedback system

### User Interface Components

1. **Main Exercise Page** (`/exercises`)
   - File upload area with drag-and-drop
   - Camera capture interface
   - Form for exercise details
   - Progress tracking

2. **Results Page** (`/exercises/[id]`)
   - Problem and solution display
   - Expandable solution steps
   - Follow-up question interface
   - Download functionality

3. **Dashboard Integration**
   - Quick action button in dashboard
   - Recent exercise history
   - Processing status tracking

## API Endpoints

### Exercise Processing

- `POST /api/exercises/process` - Process new exercise submission
- `GET /api/exercises/process` - Get user's exercise sessions

### Individual Exercise

- `GET /api/exercises/[id]` - Get exercise session details
- `DELETE /api/exercises/[id]` - Delete exercise session

### Solution Interaction

- `POST /api/exercises/[id]/followup` - Ask follow-up question
- `POST /api/exercises/[id]/regenerate` - Regenerate solution

## File Structure

```
si-japir/
├── app/
│   ├── api/
│   │   └── exercises/
│   │       ├── process/
│   │       │   └── route.ts
│   │       └── [id]/
│   │           ├── route.ts
│   │           ├── followup/
│   │           │   └── route.ts
│   │           └── regenerate/
│   │               └── route.ts
│   ├── exercises/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── dashboard/
│       └── page.tsx (updated)
├── components/
│   └── exercises/
│       ├── file-upload-area.tsx
│       ├── camera-capture.tsx
│       └── processing-progress.tsx
├── lib/
│   ├── services/
│   │   ├── ocr.ts
│   │   ├── exercise-ai.ts
│   │   └── exercise-processor.ts
│   └── types/
│       └── exercise.ts
└── prisma/
    └── schema.prisma (updated)
```

## Database Schema

### New Models

1. **ExerciseSession** - Main exercise submission
2. **ExerciseProblem** - Individual problems within a session
3. **ExerciseSolution** - Generated solutions
4. **ExerciseInteraction** - Follow-up questions and answers

### Relationships

```
User → ExerciseSession → ExerciseProblem → ExerciseSolution → ExerciseInteraction
Job → ExerciseSession (for processing tracking)
```

## Configuration

### OCR Settings

The OCR service uses Tesseract.js with Indonesian language support by default. You can customize:

- Language models
- Image preprocessing
- Confidence thresholds
- Processing timeouts

### AI Model Selection

The system automatically selects appropriate AI models based on:

- Problem type (math, coding, general)
- Difficulty level
- Subject area
- Available models

### File Upload Limits

Default limits can be configured in the file upload component:

- Maximum file size: 30MB
- Supported formats: PDF, JPG, PNG, DOCX
- Maximum files per upload: 10

## Usage Guide

### For Users

1. **Access the Feature**
   - Navigate to `/exercises` or use the dashboard quick action

2. **Submit Exercise**
   - Enter exercise title and subject
   - Upload files or capture photos
   - Click "Proses Soal"

3. **Review Results**
   - Wait for processing to complete
   - Review extracted problems and solutions
   - Expand solutions for detailed steps

4. **Interact with Solutions**
   - Ask follow-up questions
   - Request alternative solutions
   - Provide feedback on solutions

5. **Export Results**
   - Download solutions as text file
   - Copy individual solutions to clipboard

### For Developers

### Adding New Problem Types

1. Update `ProblemType` in `lib/types/exercise.ts`
2. Add corresponding AI prompts in `exercise-ai.ts`
3. Update UI components to handle new type

### Customizing AI Prompts

Modify prompts in `lib/services/exercise-ai.ts`:

```typescript
private buildSolutionPrompt(analysis: ProblemAnalysis): string {
  // Customize this method for different subjects or requirements
}
```

### Adding New OCR Languages

```typescript
// In ocr.ts
await createWorker('eng+ind', 1, {
  // Add additional languages as needed
});
```

## Performance Considerations

### Client-Side Processing

- OCR runs in the browser for privacy
- Image preprocessing for better accuracy
- Progressive loading of results

### Server-Side Optimization

- Queue-based processing for large files
- Caching of common problem patterns
- Efficient database queries

### Resource Management

- Automatic cleanup of temporary files
- Memory management for large documents
- Timeout handling for long processes

## Troubleshooting

### Common Issues

1. **OCR Not Working**
   - Check browser permissions for camera access
   - Ensure sufficient memory for processing
   - Try with smaller image files

2. **AI Processing Fails**
   - Verify API keys in environment variables
   - Check internet connection
   - Monitor API rate limits

3. **File Upload Errors**
   - Check file size limits
   - Verify supported formats
   - Ensure proper file permissions

### Debug Mode

Enable debug logging by setting:

```typescript
// In exercise-processor.ts
console.log('Debug info:', debugData);
```

### Performance Monitoring

Monitor:
- OCR processing times
- AI response times
- Memory usage during processing
- Error rates by type

## Security Considerations

### Data Privacy

- Client-side OCR when possible
- Secure file upload with validation
- User data isolation
- Automatic data cleanup

### Input Validation

- File type and size validation
- Content sanitization
- Rate limiting
- Abuse detection

## Future Enhancements

### Planned Features

1. **Real-time Collaboration**
   - Multi-user solving sessions
   - Shared workspaces
   - Live chat integration

2. **Advanced AI Features**
   - Diagram recognition
   - Handwritten equation solving
   - Voice input support

3. **Mobile App**
   - Native iOS/Android apps
   - Offline processing
   - Push notifications

4. **Integration Features**
   - LMS integration
   - Calendar sync
   - Export to multiple formats

### Scalability

- Horizontal scaling with serverless functions
- Database optimization for large datasets
- CDN integration for static assets
- Load balancing for API endpoints

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review console logs for errors
3. Verify environment configuration
4. Test with different file types

## Contributing

When contributing to the Solve Exercises feature:

1. Follow the existing code patterns
2. Add proper TypeScript types
3. Include error handling
4. Update documentation
5. Test with various file types
6. Ensure responsive design

## License

This feature is part of the Si-JAPIRS project and follows the same license terms.