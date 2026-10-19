package web

import (
	"context"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/TecharoHQ/anubis/lib/localization"
)

func TestPotigyErrorCreditsInEveryLocale(t *testing.T) {
	entries, err := os.ReadDir("../lib/localization/locales")
	if err != nil {
		t.Fatal(err)
	}
	for _, entry := range entries {
		lang := strings.TrimSuffix(entry.Name(), ".json")
		if lang == "manifest" || !strings.HasSuffix(entry.Name(), ".json") {
			continue
		}
		t.Run(lang, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/", nil)
			req.Header.Set("Accept-Language", lang)
			loc := localization.GetLocalizer(req)
			var out strings.Builder
			page := Base(loc.T("oh_noes"), ErrorPage(loc.T("access_denied"), "", "proof-code", loc), nil, nil, loc)
			if err := page.Render(context.Background(), &out); err != nil {
				t.Fatal(err)
			}
			body := out.String()
			for _, text := range []string{"Potigy", "Techaro", "CELPHASE", "proof-code", "class=\"credits\"", "https://techaro.lol", "https://bsky.app/profile/celphase.bsky.social"} {
				if !strings.Contains(body, text) {
					t.Errorf("missing visible content or attribution: %s", text)
				}
			}
			_, footer, _ := strings.Cut(body, "<footer>")
			footer, _, _ = strings.Cut(footer, "</footer>")
			if strings.Count(footer, "<p") != 1 || strings.Count(footer, "Techaro") != 1 || strings.Count(footer, "CELPHASE") != 1 || strings.Contains(footer, "Anubis") {
				t.Error("Footer must contain only one concise developer credit")
			}
			if strings.Contains(body, "<img") {
				t.Error("Mascot images must not be rendered")
			}
		})
	}
}
