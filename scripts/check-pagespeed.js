import https from 'https';

// Read URL from arguments, or default to the production site for this repo
const defaultUrl = 'https://cautioneo-gli.com';
const url = process.argv[2] || defaultUrl;

function getPageSpeed(strategy) {
    return new Promise((resolve, reject) => {
        const apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;
        https.get(apiEndpoint, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.error) {
                        reject(json.error.message);
                        return;
                    }
                    const score = Math.round(json.lighthouseResult.categories.performance.score * 100);
                    const audits = json.lighthouseResult.audits;
                    const lcp = audits['largest-contentful-paint'] ? audits['largest-contentful-paint'].displayValue : 'N/A';
                    const cls = audits['cumulative-layout-shift'] ? audits['cumulative-layout-shift'].displayValue : 'N/A';
                    const fcp = audits['first-contentful-paint'] ? audits['first-contentful-paint'].displayValue : 'N/A';
                    resolve({ score, lcp, cls, fcp });
                } catch (e) {
                    reject(e.message);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    console.log(`Checking Google PageSpeed Insights for: ${url}...`);
    console.log('Please wait, this audit takes about 15-30 seconds...');
    try {
        const [mobile, desktop] = await Promise.all([
            getPageSpeed('mobile'),
            getPageSpeed('desktop')
        ]);
        
        console.log('\n==================================================');
        console.log(`   PageSpeed Insights Performance Report: ${url}`);
        console.log('==================================================');
        console.log('📱 MOBILE STRATEGY:');
        console.log(`  - Performance Score : ${mobile.score}/100`);
        console.log(`  - LCP (Largest Paint): ${mobile.lcp}`);
        console.log(`  - CLS (Layout Shift) : ${mobile.cls}`);
        console.log(`  - FCP (First Paint)  : ${mobile.fcp}`);
        
        console.log('\n💻 DESKTOP STRATEGY:');
        console.log(`  - Performance Score : ${desktop.score}/100`);
        console.log(`  - LCP (Largest Paint): ${desktop.lcp}`);
        console.log(`  - CLS (Layout Shift) : ${desktop.cls}`);
        console.log(`  - FCP (First Paint)  : ${desktop.fcp}`);
        console.log('==================================================\n');
        
        // Enforce performance budget (Warn if below 90)
        if (mobile.score < 90 || desktop.score < 90) {
            console.log('⚠️ WARNING: Live performance scores are below the target budget of 90/100.');
            console.log('Recommend auditing large assets, preloads, and script execution times.');
        } else {
            console.log('✅ Core Web Vitals are healthy. Performance budget (90+) is satisfied.');
        }
    } catch (e) {
        console.error('Error fetching PageSpeed data:', e);
    }
}

run();
