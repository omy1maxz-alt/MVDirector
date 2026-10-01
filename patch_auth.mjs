import fs from 'fs';
let code = fs.readFileSync('src/services/youtube.ts', 'utf8');

const oldCatch = `  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  }`;

const newCatch = `  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user') {
      console.warn('Sign in cancelled by user');
    } else {
      console.error('Sign in error:', error);
    }
    throw error;
  }`;

code = code.replace(oldCatch, newCatch);
fs.writeFileSync('src/services/youtube.ts', code);
