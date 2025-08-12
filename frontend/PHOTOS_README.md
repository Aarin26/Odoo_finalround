# Adding Photos to GlobeTrotter

This guide explains how to add real photos to the GlobeTrotter application.

## Current Photo Structure

The application currently has placeholder text files for photos in the `public/photos/` directory. These need to be replaced with actual JPG/PNG image files.

## Photo Requirements

- **Format**: JPG or PNG
- **Size**: Recommended 800x600 pixels or larger (16:9 aspect ratio works well)
- **Quality**: High quality, optimized for web (under 500KB per image)
- **Content**: High-quality travel destination photos

## Required Photos

Replace these placeholder files with actual images:

### Core Destinations
- `paris.jpg` - Paris, France (Eiffel Tower, Louvre, Notre-Dame)
- `tokyo.jpg` - Tokyo, Japan (Shibuya Crossing, Tokyo Tower, Temples)
- `bali.jpg` - Bali, Indonesia (Rice Terraces, Beaches, Temples)
- `newyork.jpg` - New York City, USA (Times Square, Statue of Liberty, Central Park)
- `santorini.jpg` - Santorini, Greece (White buildings, Blue domes, Caldera)

### Additional Destinations
- `london.jpg` - London, UK (Big Ben, Tower Bridge, Buckingham Palace)
- `rome.jpg` - Rome, Italy (Colosseum, Vatican, Trevi Fountain)
- `barcelona.jpg` - Barcelona, Spain (Sagrada Familia, Park Güell, Gothic Quarter)
- `amsterdam.jpg` - Amsterdam, Netherlands (Canals, Museums, Cycling culture)
- `bangkok.jpg` - Bangkok, Thailand (Street food, Temples, Grand Palace)
- `singapore.jpg` - Singapore (Marina Bay Sands, Gardens by the Bay, Chinatown)
- `seoul.jpg` - Seoul, South Korea (Gyeongbokgung Palace, Myeongdong, Namsan Tower)
- `dubai.jpg` - Dubai, UAE (Burj Khalifa, Palm Jumeirah, Dubai Mall)
- `capetown.jpg` - Cape Town, South Africa (Table Mountain, V&A Waterfront, Cape Point)
- `sydney.jpg` - Sydney, Australia (Opera House, Harbour Bridge, Bondi Beach)
- `reykjavik.jpg` - Reykjavik, Iceland (Northern Lights, Geothermal pools, Blue Lagoon)

### Default Photo
- `default.jpg` - Generic travel/exploration image

## How to Add Photos

1. **Download high-quality images** from stock photo websites like:
   - Unsplash (free)
   - Pexels (free)
   - Shutterstock (paid)
   - Adobe Stock (paid)

2. **Rename the images** to match the filenames above

3. **Optimize the images** for web:
   - Resize to 800x600 pixels or similar aspect ratio
   - Compress to under 500KB
   - Use JPG format for photos, PNG for graphics

4. **Replace the placeholder files** in `public/photos/`

## Photo Sources

### Free Photo Sources
- **Unsplash**: https://unsplash.com/s/photos/travel
- **Pexels**: https://www.pexels.com/search/travel/
- **Pixabay**: https://pixabay.com/images/search/travel/

### Search Terms for Each Destination
- Paris: "paris landmarks", "eiffel tower", "louvre museum"
- Tokyo: "tokyo city", "shibuya crossing", "japanese temples"
- Bali: "bali beaches", "rice terraces", "indonesian temples"
- New York: "new york city", "times square", "statue of liberty"
- Santorini: "santorini greece", "white buildings", "greek islands"

## Implementation Notes

The photos are automatically displayed in:
- **Community Page**: Trip cards show destination photos
- **Explore Page**: Destination cards show city photos
- **Dashboard**: Trip cards and hero section show photos
- **Photo Gallery Component**: Reusable component for displaying multiple photos

## Troubleshooting

- **Images not loading**: Check file paths and ensure images are in `public/photos/`
- **Poor image quality**: Use higher resolution images and optimize for web
- **Slow loading**: Compress images to reduce file size
- **Layout issues**: Ensure images have consistent aspect ratios

## Next Steps

1. Replace all placeholder files with real photos
2. Test the application to ensure photos display correctly
3. Consider adding more destinations and photos
4. Implement photo lazy loading for better performance
