import UIKit
import WebKit

final class MovieTimeCapsuleViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {
    private var webView: WKWebView!

    override func loadView() {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true

        if #available(iOS 10.0, *) {
            configuration.mediaTypesRequiringUserActionForPlayback = []
        }

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.allowsBackForwardNavigationGestures = false
        webView.isOpaque = false
        webView.backgroundColor = .black
        webView.scrollView.backgroundColor = .black
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        self.webView = webView
        self.view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        loadBundledPage()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        webView.frame = view.bounds
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        .lightContent
    }

    private func loadBundledPage() {
        guard let bundleURL = Bundle.main.resourceURL else { return }

        let pageURL = bundleURL.appendingPathComponent("tools/MovieTimeCapsule.html")
        guard FileManager.default.fileExists(atPath: pageURL.path) else { return }

        var components = URLComponents(url: pageURL, resolvingAgainstBaseURL: false)
        components?.queryItems = [URLQueryItem(name: "app", value: "ipad")]
        webView.loadFileURL(components?.url ?? pageURL, allowingReadAccessTo: bundleURL)
    }

    func webView(
        _ webView: WKWebView,
        createWebViewWith configuration: WKWebViewConfiguration,
        for navigationAction: WKNavigationAction,
        windowFeatures: WKWindowFeatures
    ) -> WKWebView? {
        if let url = navigationAction.request.url {
            UIApplication.shared.open(url)
        }
        return nil
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        decisionHandler(.allow)
    }
}
