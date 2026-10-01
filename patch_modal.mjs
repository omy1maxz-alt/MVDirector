import fs from 'fs';
let code = fs.readFileSync('src/components/YouTubeImportModal.tsx', 'utf8');

const oldCatch = `    } catch (err) {
      console.error('Login failed:', err);
    } finally {`;

const newCatch = `    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        console.warn('Login cancelled by user');
      } else {
        console.error('Login failed:', err);
      }
    } finally {`;

code = code.replace(oldCatch, newCatch);
fs.writeFileSync('src/components/YouTubeImportModal.tsx', code);
