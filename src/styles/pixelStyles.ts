// styles/pixelStyles.js
import { StyleSheet } from 'react-native';

export const pixel = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010326',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    color: '#EAF205',
    fontSize: 22,
    textAlign: 'center',
    fontFamily: '8bit',
    marginBottom: 40,
    textTransform: 'lowercase',
  },
  input: {
    color: 'white',
    width: '90%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 18,
    marginVertical: 12,
    backgroundColor: 'transparent',
    
    fontFamily: '8bit',
    textAlign: 'center',
    // REMOVED borderBottomWidth: 1.5,
    // REMOVED borderBottomColor: 'rgba(255, 255, 255, 0.6)',
  },
  button: {
    width: '90%',
    paddingVertical: 18,
    marginVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#EAF205',
    fontSize: 16,
    fontFamily: '8bit',
    textTransform: 'lowercase',
  },
  secondaryButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: '8bit',
    textTransform: 'lowercase',
    marginTop: 15,
  },
  subtleButton: {
    width: '90%',
    paddingVertical: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  subtleText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    fontFamily: '8bit',
    textTransform: 'lowercase',
  },
  startWithoutAccount: {
    width: '90%',
    paddingVertical: 18,
    marginVertical: 12,
    alignItems: 'center',
  }
});