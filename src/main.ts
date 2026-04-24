import { Plugin, Menu, TFolder, Notice } from 'obsidian';

export default class CreatePPTPlugin extends Plugin {
    async onload() {
        console.log('✅ 插件：在文件夹创建PPT 已加载');

        // 注册文件夹右键菜单
        this.registerEvent(
            this.app.workspace.on('file-menu', (menu, file) => {
                if (file instanceof TFolder) {
                    this.addCreatePPTMenuItem(menu, file);
                }
            })
        );
    }

    // 添加右键菜单项
    addCreatePPTMenuItem(menu: Menu, folder: TFolder) {
        menu.addItem(item => {
            item
                .setTitle('在此处创建PPT文件')
                .setIcon('presentation') // 更贴合PPT的图标
                .onClick(() => this.createPPTFile(folder));
        });
    }

    // 核心：安全创建PPT，自动处理重名（加序号）
    async createPPTFile(folder: TFolder) {
        const baseName = '新建PPT';
        const extension = '.pptx';
        let finalFileName = baseName + extension;
        let counter = 1;

        try {
            // 循环判断文件是否存在，存在就加序号
            while (true) {
                const fullPath = `${folder.path}/${finalFileName}`;
                
                // 判断文件是否已存在
                const exists = await this.app.vault.adapter.exists(fullPath);
                if (!exists) break;

                // 存在 → 修改文件名
                finalFileName = `${baseName}-${counter}${extension}`;
                counter++;
            }

            // 创建空白PPT文件
            const fullPath = `${folder.path}/${finalFileName}`;
            await this.app.vault.create(fullPath, '');

            // 成功提示
            new Notice(`✅ PPT已创建：${finalFileName}`);
        } catch (err) {
            new Notice(`❌ 创建失败：${err.message}`);
        }
    }
}