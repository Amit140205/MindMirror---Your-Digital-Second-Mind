export function buildWelcomeEmail(userName) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MindMirror</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:'Inter',Arial,sans-serif;color:#EEEEF5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0F;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#12121A;border:1px solid #2A2A3D;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#12121A;padding:28px 40px;border-bottom:1px solid #2A2A3D;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:20px;font-weight:700;color:#EEEEF5;letter-spacing:-0.5px;">🪞 MindMirror</span>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;color:#44445A;letter-spacing:0.5px;text-transform:uppercase;">Your Digital Second Mind</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:40px 40px 0px;">

              <p style="font-size:26px;font-weight:700;color:#EEEEF5;margin:0 0 12px;line-height:1.3;">
                Hey ${userName} 👋
              </p>
              <p style="font-size:15px;color:#8888AA;line-height:1.8;margin:0 0 32px;">
                Welcome to MindMirror — your personal browsing memory. 
                We're glad you're here. From this moment, MindMirror quietly 
                works in the background so you never lose track of what you've read, 
                researched, or discovered online.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #2A2A3D;margin:0 0 32px;">

              <!-- How it works -->
              <p style="font-size:13px;font-weight:700;color:#6C63FF;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 20px;">
                How it works
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                ${[
                  ["🌐", "Browse normally", "No bookmarking, no manual saving. MindMirror silently remembers the pages you visit and how long you spent on them."],
                  ["💬", "Ask in plain English", "Open MindMirror and ask anything — \"What was I reading about React last week?\" or \"How much time did I spend on YouTube today?\""],
                  ["✦", "Get answers from your own history", "MindMirror searches only your personal browsing data — not the web. Everything it tells you comes from what you actually visited."],
                ].map(([icon, title, desc]) => `
                  <tr>
                    <td style="padding:0 0 20px;vertical-align:top;">
                      <div style="background:#1C1C28;border:1px solid #2A2A3D;border-radius:12px;padding:16px 18px;display:flex;align-items:flex-start;gap:14px;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="vertical-align:top;padding-right:14px;">
                              <div style="width:36px;height:36px;background:#6C63FF22;border:1px solid #6C63FF44;border-radius:10px;text-align:center;line-height:36px;font-size:16px;flex-shrink:0;">
                                ${icon}
                              </div>
                            </td>
                            <td style="vertical-align:top;">
                              <span style="font-size:14px;font-weight:600;color:#EEEEF5;display:block;margin-bottom:5px;">${title}</span>
                              <span style="font-size:13px;color:#8888AA;line-height:1.7;">${desc}</span>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </table>

              <!-- Privacy -->
              <p style="font-size:13px;font-weight:700;color:#00D4AA;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px;">
                Your privacy, by design
              </p>
              <p style="font-size:14px;color:#8888AA;line-height:1.8;margin:0 0 20px;">
                MindMirror was built with privacy at its core — not as an afterthought. 
                Here's what that means for you:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                ${[
                  ["🚫", "Sensitive sites are never tracked", "Banking, payments, password managers, and government portals are blocked by default — always."],
                  ["🛡️", "Sensitive pages are automatically skipped", "If a page has password fields, card inputs, or OTP boxes, MindMirror detects it and skips that page entirely — no data captured."],
                  ["🔒", "Your data is encrypted", "Everything MindMirror captures is encrypted before it ever leaves your browser. Only you can access it."],
                  ["🤐", "The AI never reveals sensitive info", "Even if something sensitive was accidentally captured, the AI is trained to never show it to you or anyone else."],
                ].map(([icon, title, desc]) => `
                  <tr>
                    <td style="padding:0 0 12px;vertical-align:top;">
                      <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="vertical-align:top;width:28px;font-size:16px;padding-top:1px;">${icon}</td>
                          <td style="vertical-align:top;padding-left:10px;">
                            <span style="font-size:14px;font-weight:600;color:#EEEEF5;display:block;margin-bottom:3px;">${title}</span>
                            <span style="font-size:13px;color:#8888AA;line-height:1.7;">${desc}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                `).join("")}
              </table>

              <!-- Your controls -->
              <p style="font-size:13px;font-weight:700;color:#FFB347;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px;">
                You're always in control
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                ${[
                  ["Block any site", "Go to Settings → Ignored Domains. Any domain you add will never be tracked, ever."],
                  ["Delete everything", "Settings → Clear Browsing History wipes all your data from our servers instantly. No questions asked."],
                  ["Your chat stays private", "Conversations reset when you close the browser. Nothing persists beyond your session."],
                ].map(([title, desc]) => `
                  <tr>
                    <td style="padding:0 0 10px;vertical-align:top;">
                      <div style="background:#1C1C28;border:1px solid #2A2A3D;border-radius:10px;padding:13px 16px;">
                        <span style="font-size:13px;color:#EEEEF5;font-weight:600;display:block;margin-bottom:4px;">${title}</span>
                        <span style="font-size:12px;color:#8888AA;line-height:1.6;">${desc}</span>
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </table>

              <!-- Promise -->
              <div style="background:#6C63FF11;border:1px solid #6C63FF33;border-radius:12px;padding:20px 22px;margin:0 0 32px;">
                <p style="font-size:14px;font-weight:600;color:#EEEEF5;margin:0 0 8px;">Our promise to you</p>
                <p style="font-size:13px;color:#8888AA;line-height:1.8;margin:0;">
                  We will never sell your data. We will never use it for advertising. 
                  MindMirror exists for one reason — to help <strong style="color:#EEEEF5;">you</strong> remember better. 
                  That's it.
                </p>
              </div>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
                <tr>
                  <td align="center">
                    <a href="#" style="display:inline-block;background:#6C63FF;color:#fff;font-size:14px;font-weight:600;
                      text-decoration:none;padding:14px 40px;border-radius:10px;letter-spacing:0.2px;">
                      Open MindMirror
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0A0A0F;padding:28px 40px;border-top:1px solid #2A2A3D;text-align:center;margin-top:32px;">
              <p style="font-size:12px;color:#44445A;margin:0 0 6px;line-height:1.7;">
                MindMirror · Built for your memory, not our metrics
              </p>
              <p style="font-size:11px;color:#2A2A3D;margin:0;">
                You received this because you just signed up. This is the only email we'll ever send you.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}