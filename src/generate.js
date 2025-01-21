const fs = require("fs-extra");
const Handlebars = require("handlebars");
const path = require("path");

(async () => {
    try {
        // Diretórios
        const imagesDir = path.join(__dirname, "images");
        const templateFile = path.join(__dirname, "templates", "index.hbs");
        const outputDir = path.join(__dirname);
        const outputFile = path.join(outputDir, "index.html");

        // Verificar se o diretório de saída existe
        await fs.ensureDir(outputDir);

        // Listar imagens no diretório
        const images = (await fs.readdir(imagesDir)).map((file) =>
            path.join("images", file)
        );

        // Ler template
        const templateContent = await fs.readFile(templateFile, "utf8");
        const template = Handlebars.compile(templateContent);

        // Gerar HTML
        const html = template({ images });
        await fs.writeFile(outputFile, html, "utf8");

        console.log("HTML gerado com sucesso em:", outputFile);
    } catch (error) {
        console.error("Erro ao gerar HTML:", error);
    }
})();
