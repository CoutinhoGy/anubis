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
			for _, text := range []string{"Potigy", "Techaro", "CELPHASE", "proof-code", "potigy-credit", "https://techaro.lol", "https://bsky.app/profile/celphase.bsky.social"} {
				if !strings.Contains(body, text) {
					t.Errorf("missing visible content or attribution: %s", text)
				}
			}
			if strings.Index(body, `class="potigy-credit"`) < strings.Index(body, "celphase.bsky.social") {
				t.Error("Potigy credit must follow the original creator credits")
			}
		})
	}
}
